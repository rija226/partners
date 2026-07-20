# Blob Image Ingest Pipeline — Plan (Contentful publish → Azure Blob)

**Status: planning only, nothing in this document has been implemented.**

Scope note: this is deliberately narrower than `docs/image-pipeline-plan.md` (which also covered
SAS-link downloads and gallery display changes). This document is **only** about the ingest side:
getting an image from Contentful onto Blob (both `originals/` and `web/`) the moment it's
published. Serving/downloading from Blob afterward is out of scope here.

## 1. Current state (verified against the actual repo)

### Contentful wiring
- `src/third-party/services/contentful-service.ts`: one `createClient()` built once from
  `CONTENTFUL_SPACE_ID` / `CONTENTFUL_DELIVERY_TOKEN` / `CONTENTFUL_ENVIRONMENT`, and one private
  `getEntries<T>(contentType, filter)` that every exported function wraps. This is a **read-only,
  Content Delivery API** client — it fetches published content for rendering, nothing more. There
  is no Content Management API client anywhere (the one that could, e.g., write back a "blob path"
  field onto an entry) and no Contentful webhook receiver of any kind yet.
- `src/adapters/contentful-response.adapter.ts`: `keepFieldsOnly()` / `flattenAsset()` — generic,
  recursive flattening of Contentful entries/assets for rendering. Relevant detail: `flattenAsset`
  only reads `asset.fields.file.url` / `.details` / `.contentType` / `.fileName` — i.e., exactly the
  shape of a Contentful **Asset publish webhook payload's `fields.file` object**. Useful later: the
  webhook payload and the CDA response shape this adapter already parses are close enough that some
  of this parsing logic could plausibly be reused (see Section 2.3), not reinvented.
- Content types with image fields today: `accommodationObject.featuredImage` (single Asset),
  `factSheetGroup.image` (single Asset, banner), `galleryBlock.images` (**Array of Asset links**,
  `linkMimetypeGroup: ["image"]`, max 20,971,520 bytes/file — this is the field your 57-per-object,
  5464×3640, ~6.5MB photos live in). As of the last check, `galleryBlock` has 0 live entries.

### Where images render today
- `src/components/GalleryBlock/GalleryBlock.tsx` — the gallery grid + `yet-another-react-lightbox`
  modal. Currently reads `image.url` straight from the Contentful-flattened asset (a
  `https://images.ctfassets.net/...` URL) for both the thumbnail and the lightbox/download — no
  resize, no derivative, no Blob involvement anywhere. This is the component that will eventually
  need to point at the `web/` Blob URL instead, but **that change is out of scope for this plan** —
  noted only so it's clear nothing here touches it yet.

### Existing Azure/storage code
- None. No `@azure/*` package in `package.json`, no Blob/SAS/storage code anywhere in `src/`,
  `pages/`, or `scripts/` (grepped, zero matches), no storage-related env vars in `env.template`.

### Existing server-side layer to hook into
- `pages/api/` currently has exactly **two** routes: `login.ts` (password check, sets the auth
  cookie) and `accommodations.ts` (a simple read-through to `getAccommodations()` for the header
  dropdown). Both are small, fast, synchronous, and have nothing to do with file processing.
- **There is no existing webhook receiver, queue, background job, or file-processing code of any
  kind in this repo.** This entire layer needs to be created from nothing — there's no partial
  infrastructure to extend.
- Relevant, easy-to-miss fact for the "where should this run" question in Section 2.2: the
  blueprint (`../partners-site-blueprint.md`) documents **Netlify** as the intended deploy target
  (`@netlify/plugin-nextjs`, "not yet installed, add when the deployment is connected") — this is
  planned, not yet configured (no `netlify.toml` in the repo), but it's the documented direction. A
  Next.js API route in this project, once deployed, would run as a **Netlify Function** under the
  hood, which matters directly for Decision/Recommendation below.

---

## 2. The Blob side, step by step

### 2.1 Azure resources needed (you'll create these separately)

- One **Storage Account** (Blob Storage, Hot access tier — these get downloaded/viewed regularly,
  not archived).
- Inside it, either two **containers** (`originals`, `web`) or one container with two path
  prefixes (`gallery/originals/...`, `gallery/web/...`) — containers are the cleaner boundary here
  since `originals` should end up with different access rules than `web` eventually (originals are
  the ones a future SAS-gated download flow would protect; `web` derivatives are what a public-ish
  `next/image` `remotePatterns` host serves) — recommend **two containers**, not prefixes, so that
  distinction is enforceable at the container level later, not just by convention.
- **Blob naming convention** (this needs deciding now, see Decision 3 below) — recommended:
  key every blob by the **Contentful Asset's own `sys.id`**, not by which entry/gallery references
  it:
  ```
  originals/<contentfulAssetId>.<ext>
  web/<contentfulAssetId>.webp
  ```
  Reasoning tied to this repo: a Contentful Asset's `sys.id` is stable, globally unique within the
  space, and is present directly in the Asset-publish webhook payload — no need to look up which
  `galleryBlock` entry (or entries — the same asset could in principle be linked from more than
  one) currently references it. Keying by entry/gallery instead would require an extra Contentful
  query per webhook call just to find the parent, for no benefit at ingest time.

### 2.2 Processing flow: Azure Function vs. Next.js API route

**Recommendation: Azure Function (HTTP-triggered), not a Next.js API route.** Reasoning, tied
specifically to what's actually in this repo and its documented deploy target:

| Consideration | Next.js API route (this repo) | Azure Function |
|---|---|---|
| Runtime, once deployed | Becomes a **Netlify Function** (per the blueprint's documented, if not-yet-configured, deploy target) | Runs natively where Blob already lives |
| Execution time budget | Netlify's synchronous function default/hard limits are tight (single-digit to ~26s depending on plan) for what's actually happening here: download a ~6.5MB original from Contentful's CDN, resize with `sharp`, then upload *two* files to Blob | Azure Functions' HTTP trigger has a much more generous, configurable timeout — a better fit for this specific chain of network + CPU work |
| `sharp`'s native binary | Would get bundled into the **same** serverless function package as the rest of this small Next.js app — real risk of bundle-size/cold-start problems on a platform (Netlify) this app doesn't currently need heavy native deps for at all | Isolated to its own deployable; doesn't affect the main site's function bundle or reliability at all |
| Blast radius if this breaks | A bug or timeout in image processing shares fate with the app that also serves every page/login/gallery request | Fully decoupled — a stuck or failing ingest run can't take down or slow down the actual partner-facing site |
| Contentful webhook integration cost | Identical either way — Contentful just POSTs to a URL; it doesn't care whether that URL is a Netlify Function or an Azure Function | Identical |

The one real cost of this recommendation: the ingest code ends up living **outside** this Next.js
app's own build/deploy pipeline (a separate Azure Functions project, even if kept in the same git
repo as a sibling folder). Given you're already setting up the Azure side separately, this seems
like the right trade — flagging it explicitly rather than assuming you're fine with it.

### 2.3 Where the code should live

Given the recommendation above, the fetch→resize→upload code is **not** part of this Next.js app's
`src/`/`pages/` tree at all (those are Netlify-deployed, and per 2.2 we're deliberately keeping this
off that deploy). Suggested structure, as a sibling to the existing app rather than inside it:

```
partners-site/
  pages/, src/, ...           (existing Next.js app — untouched by this work)
  azure/
    image-ingest/             (a separate Azure Functions project)
      src/functions/
        onAssetPublished.ts   (HTTP trigger, receives the Contentful webhook payload)
      package.json            (own deps: @azure/storage-blob, sharp, azure-functions-core-tools)
      host.json / local.settings.json
```

Rough shape of `onAssetPublished.ts` (illustrative, not final — actual Function-runtime
boilerplate depends on the Functions version/language model you set up in Azure, which you'll do
separately):

1. Verify the request really came from Contentful (shared-secret header — Decision 5 below).
2. Read the Asset's `fields.file` from the webhook payload — same shape
   `flattenAsset()` in this repo already parses (`url`, `contentType`, `fileName`,
   `details.size`, `details.image.{width,height}`), so the *parsing* logic can be ported/adapted
   from there rather than re-derived from scratch, even though this new code doesn't live in this
   codebase.
3. Fetch the original from the payload's `https:` + `fields.file.url`.
4. Upload it unmodified to `originals/<assetId>.<ext>`.
5. Resize to ~2000px wide with `sharp`, encode as WebP, upload to `web/<assetId>.webp`.
6. Nothing writes back to Contentful in this plan — Section 1 already noted there's no Content
   Management API client in this repo, and adding one is a separate decision (see Decision 4) not
   assumed here.

### 2.4 Env vars / secrets

These belong to the **Azure Function's** own configuration (its `local.settings.json` locally, and
Azure's Application Settings once deployed) — not this Next.js app's `.env.local`, since the
processing code doesn't run inside this app (per 2.2):

```
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=           # or switch to Managed Identity once the Function runs in Azure — no key to leak then
AZURE_STORAGE_CONTAINER_ORIGINALS=
AZURE_STORAGE_CONTAINER_WEB=
CONTENTFUL_WEBHOOK_SECRET=           # shared secret Contentful sends on every webhook call, verified in step 2.3.1
WEB_IMAGE_MAX_WIDTH=2000
```

If a Content Management API write-back ever gets added later (Decision 4), it would need its own
`CONTENTFUL_MANAGEMENT_TOKEN` at that point — not included here since it's not part of this plan.

---

## 3. What's testable locally now vs. needs the real Azure setup

**Testable now, no Azure account needed yet:**
- The fetch-from-Contentful + `sharp` resize-to-WebP logic in isolation (point it at any known
  Contentful asset URL from this space, confirm it produces a correctly-sized WebP locally).
- The webhook payload shape/parsing (Contentful's Asset-publish webhook payload is documented and
  stable; you can simulate a call with a saved sample payload before any Function exists).

**Needs a real Azure Storage account (a free/dev-tier one is enough — doesn't need to be the final
production account):**
- The actual Blob upload calls (`@azure/storage-blob` needs a real account/container to talk to;
  Azurite, Microsoft's local Storage emulator, is an option if you want to test upload code with
  zero Azure account at all, but you said you don't have Azure access yet, not that you're avoiding
  it entirely — worth knowing Azurite exists if you want a faster local loop before touching the
  real account).
- End-to-end: Contentful webhook → Function → both blobs actually present in the right containers.

**Needs the real Contentful webhook configured (space settings, not code):** the trigger itself —
you can call the Function's HTTP endpoint manually with a sample payload to test the processing
logic before wiring up the real webhook in Contentful's space settings.

---

## 4. Decisions to make before implementation

1. **Confirmed by your brief already** (not asking, just recording): Contentful stays the upload
   CMS for marketing; two Blob destinations (`originals/`, `web/`); ~2000px WebP for the web
   version; triggered on Contentful publish. These are treated as settled for this plan.
2. **Function vs. API route** — recommended Azure Function above (Section 2.2); flagging in case
   there's a reason to prefer keeping everything in one deployable despite the Netlify/`sharp`/
   blast-radius concerns (e.g. team familiarity, wanting one less system to operate).
3. **Blob naming/folder convention** — recommended keying by Contentful Asset `sys.id`
   (Section 2.1). Alternative would be keying by accommodation slug + index (e.g.
   `originals/hotel-parentium/03.jpg`), which reads nicer in the Azure portal but requires an extra
   Contentful lookup per webhook call to resolve "which entry does this asset belong to" — and
   breaks if the same asset is ever reused across entries. Confirm the `sys.id` approach is fine,
   or if human-readable paths matter enough to pay that cost.
4. **Overwrite vs. versioning on republish.** If marketing replaces an image in Contentful (same
   Contentful Asset, new file), does the new upload simply overwrite `originals/<assetId>.<ext>`
   and `web/<assetId>.webp` in place (simplest, but the old file is gone — no history), or should
   each publish produce a new versioned blob name (e.g. suffixed with the Asset's `sys.revision` or
   `sys.updatedAt`) and something (not yet designed, since there's no Content Management API client
   in this repo today) needs to track "which version is current"? Overwrite-in-place is simpler and
   matches how Contentful Assets themselves behave (one asset, replaceable file) — recommended
   unless there's a specific reason to keep old versions around.
5. **Webhook authenticity check.** Contentful supports a custom header with a shared secret on
   outgoing webhooks — confirm you want to use that (simple, sufficient) rather than IP allowlisting
   or a signed-payload scheme; simple shared-secret matches the scale/sensitivity of this task.
6. **Which Contentful webhook event fires this** — recommended: the **Asset publish** event
   specifically (one image at a time, matches "when an image is published" exactly as stated),
   *not* an Entry publish event on `galleryBlock` (which would fire once for a whole gallery and
   require diffing which images in the array are actually new/changed vs. already processed —
   meaningfully more complex for no clear benefit here).

---

**Nothing above has been implemented.** Say go-ahead (and which way the decisions above land)
before I write any of this — including the Function project scaffold, since per Section 2.2 that
wouldn't even live inside this repo's normal build.

---

## 5. Checklist — who does what, in order

**Step 1 — Decisions (yours, ~5 min, no Azure needed).** Confirm or override the 6 recommendations
in Section 4, or just say "go with your recommendations" to accept all of them as-is.

**Step 2 — Code (mine, starts right after Step 1, no Azure needed yet).** Scaffold
`azure/image-ingest/`, write the fetch→resize→upload logic, test it against **Azurite** (local Blob
emulator) so real progress happens before you have Azure access. Deliverable: working, locally
tested code + an env var list (names only, you fill in real values in Step 3/4).

**Step 3 — Azure resources (yours, whenever you get access).**
- [ ] Storage Account (Blob Storage, Hot tier)
- [ ] Two containers: `originals`, `web`
- [ ] Copy the Storage Account name + key (or set up Managed Identity later, per Section 2.4)
- [ ] A Function App to deploy `azure/image-ingest/` into (Node.js runtime, HTTP trigger) — this is
      just a deployment target; the code from Step 2 already works locally without it existing yet

**Step 4 — Deploy the Function (yours, needs Step 3's Function App to exist).** Deploy the code
from Step 2, set its Application Settings to the real values (Section 2.4's env var list). Note the
Function's public HTTP trigger URL — you'll need it for Step 5.

**Step 5 — Wire up the Contentful webhook (yours, needs Step 4's URL, needs Contentful space admin
access).**
- [ ] Pick/generate a random string for `CONTENTFUL_WEBHOOK_SECRET` (same value goes into Step 4's
      Function settings and this webhook's custom header — do this once, use it in both places)
- [ ] Contentful → Settings → Webhooks → new webhook → trigger on **Asset: Publish** only (per
      Decision 6) → URL = the Function's trigger URL from Step 4 → add the secret as a custom
      header

**Step 6 — End-to-end test (yours + mine, needs everything above).** Publish a real image in
Contentful, confirm both `originals/<assetId>.<ext>` and `web/<assetId>.webp` show up in the right
containers.

Steps 3 and 2 can happen in parallel — Step 2 doesn't block on you having Azure access, so there's
no reason to wait.
