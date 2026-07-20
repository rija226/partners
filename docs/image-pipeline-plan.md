# Image Handling Pipeline — Plan (Contentful → Azure Blob)

**Status: planning only, nothing in this document has been implemented.**

## 1. Current state (verified against the actual repo, not assumed)

### Framework / routing
- Next.js **16.2.10**, **Pages Router** (not App Router) — `pages/index.tsx`, `pages/[...slug].tsx`
  (generic CMS catch-all), `pages/login.tsx`, `pages/api/`.
- TypeScript (strict), styled-components v6, `next-i18next` (en/hr).
- No `app/` directory anywhere in the repo.

### Contentful wiring
- Single client, single generic fetch — `src/third-party/services/contentful-service.ts`:
  - `createClient({ space: CONTENTFUL_SPACE_ID, accessToken: CONTENTFUL_DELIVERY_TOKEN, environment: CONTENTFUL_ENVIRONMENT })`,
    built once at module load from env vars, `null` if creds are missing.
  - One private `getEntries<T>(contentType, filter)` wraps every Contentful call
    (`content_type` + `include: 5` + whatever filter is passed). Every public function
    (`getPageByUrl`, `getAccommodations`, `getFactSheetGroups`) is a thin wrapper over this.
  - **Adapter** — `src/adapters/contentful-response.adapter.ts`: `keepFieldsOnly()` recursively
    flattens a raw Contentful entry's `fields`, turning nested Entry links into more flattened
    entries and nested Asset links into a `FlattenedAsset` (see below). No per-content-type
    parsers exist yet — this is the single, generic place all Contentful shaping happens.
- Content types with an image-carrying field, as they exist right now:
  - `accommodationObject.featuredImage` — single Asset, required.
  - `factSheetGroup.image` — single Asset, optional (hero banner behind the fact-sheet download
    section — this one and `factSheetGroup.file`, the PDF itself, are **out of scope** for this
    plan; the ask is specifically about gallery photos).
  - `galleryBlock.images` — **Array of Asset links**, restricted to `image` mimetype, max
    20,971,520 bytes (20MB) per file. This is the field the 5464×3640 / ~6.5MB / up to 57-per-object
    photos live in. As of the last check this field has 0 live entries — real photo content hasn't
    been populated yet, so there's no in-place migration of *published* gallery images yet, only a
    content-model shape to change.

### Image handling today
- `next/image` is used everywhere images render: `Header` (static logo), `AccommodationHero`,
  `FactSheetGroup` (banner), `GalleryBlock` (thumbnails).
- `next.config.ts` has exactly one remote pattern configured:
  ```ts
  images: { remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }] }
  ```
  This is the **only** image host the app currently knows about — an Azure Blob hostname isn't
  there yet.
- **Gallery component**: `src/components/GalleryBlock/GalleryBlock.tsx`. Existing behavior:
  - Renders a responsive grid of thumbnails via `next/image` (`fill`, `object-fit: cover`),
    reading directly from the Contentful-flattened `image.url` (already a full
    `https://images.ctfassets.net/...` URL with no resize/format query params applied).
  - Clicking a thumbnail opens a `yet-another-react-lightbox` modal (`Counter`, `Download`, `Zoom`
    plugins already installed and wired) that can navigate across the whole gallery.
  - **The per-image Download link (both the grid's own link and the lightbox's `Download` plugin)
    points straight at the original Contentful asset URL** (`image.url`, `download` attribute) —
    this is the exact behavior the new architecture needs to replace. There is no resize step and
    no separate "display" vs. "download" URL anywhere in the current code; display and download
    are the same original file.
- Nothing anywhere resizes, transforms, or generates a smaller derivative of an image. Contentful's
  own Images API (`?w=…&fm=webp`) isn't used either — every `<Image>` and every download link uses
  the raw asset URL as Contentful returns it (`adapter`'s `flattenAsset` just prefixes `https:`,
  nothing else).

### Auth
- Single shared password, exactly matching what you described for the WP site.
  - `src/helpers/auth.ts`: `verifyPassword(password)` → `bcrypt.compare(password, process.env.PARTNER_PASSWORD)`
    (env var holds a bcrypt hash, not the plaintext password). `serializeAuthCookie()` sets a cookie
    named `partners-auth` (see `src/helpers/auth-cookie-name.ts`) with value `"authenticated"`,
    `httpOnly`, `sameSite: lax`, 30-day max-age.
  - `pages/api/login.ts` is the only endpoint that checks the password and sets the cookie.
  - `pages/login.tsx` — one password `<input>`, no username field. Matches "single shared password,
    one input" exactly.
  - **`proxy.ts`** (Next 16 renamed Middleware → Proxy) is the site-wide gate: every route except
    `/login*` and **anything under `/api/*`** gets redirected to `/login` unless the
    `partners-auth` cookie is present and equal to `"authenticated"`.
  - **Important, easy to miss**: because `proxy.ts` explicitly skips `/api/*`, **a new API route
    (e.g. a SAS-link endpoint) is NOT automatically protected** by the existing site-wide gate. It
    would need its own auth check inside the handler (read the same cookie, verify the same value).
    This is a real gap to design around, not just a note — see Gaps/Decisions below.

### Azure / storage
- No Azure SDK packages installed (`package.json` has no `@azure/*` dependency).
- No Azure/Blob/SAS-related code anywhere in the repo (`src/`, `pages/`, `scripts/` — grepped, zero
  matches).
- `env.template` currently only has `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`,
  `CONTENTFUL_ENVIRONMENT`, `SITE_URL`, `PARTNER_PASSWORD`. Nothing storage-related.

---

## 2. Gaps between current state and target architecture

1. **No separate "web" vs. "original" image at all.** Display and download currently use the exact
   same Contentful-hosted original. There's no resize step, no format conversion, and no second
   asset/derivative anywhere.
2. **No Azure Blob Storage integration** — no SDK, no container, no upload path, no env vars.
3. **No SAS token generation** — nothing issues time-limited download URLs; the current download
   link is a permanent, unauthenticated, direct Contentful CDN URL embedded in the page HTML.
4. **No mechanism to get an image from Contentful into Azure** — no webhook handler, no migration
   script, nothing that reacts to a Contentful asset being published.
5. **Content model still stores the image itself in Contentful** (`galleryBlock.images` is an
   Asset-link array). The target architecture ("Contentful stores text/structure only") means this
   field's *type* is wrong for where you're headed, not just the code reading it — this is a
   content-model change, not only a code change. (Whether Contentful Assets stay as the **upload
   intake mechanism** with a webhook mirroring to Azure, or editors stop uploading to Contentful
   Assets entirely, is exactly Decision A below — flagging, not deciding.)
6. **New API route(s) won't inherit the existing auth gate.** `proxy.ts` skips all of `/api/*` by
   design (so `pages/api/login.ts` itself is reachable pre-auth) — a download/SAS-issuing endpoint
   must check the `partners-auth` cookie itself; this doesn't come for free.
7. **`next.config.ts`'s `images.remotePatterns` only allows `images.ctfassets.net`.** Once the web
   version lives on Azure, the Azure Blob (or CDN/Front Door) hostname needs adding here, or
   `next/image` will refuse to optimize/serve it — same class of bug already hit once in this repo
   when `images.ctfassets.net` itself was missing (see `CLAUDE.md`'s existing note on that).
8. **Contentful's own Images API (`?w=&fm=webp`) is not being used, and switching to it alone
   would *not* solve the stated problem** — it's still Contentful's CDN serving the bytes, so it
   still counts against the same shared bandwidth quota. Worth stating explicitly so nobody
   suggests "just add resize query params to the existing Contentful URLs" as a shortcut later.

---

## 3. Step-by-step plan

### A. What happens in Azure (you'll set this up separately — described, not built here)

1. **Blob container(s)**: at minimum a private container for originals (e.g. `gallery-originals`)
   and one for web-resolution derivatives (e.g. `gallery-web`), or a folder-prefix convention
   inside one container (`/originals/<accommodation-slug>/<n>.jpg`,
   `/web/<accommodation-slug>/<n>.webp`) — either works, pick one before writing upload code since
   the blob-path convention is what the Next.js code will need to reconstruct URLs from.
2. **Ingest mechanism** (this is where Decision A below matters): something needs to move bytes
   from Contentful into that container. Two shapes, pick one:
   - **Contentful webhook → Azure Function**: on asset publish, Contentful POSTs to a webhook URL;
     an Azure Function (HTTP-triggered) downloads the original from the Contentful CDN URL in the
     payload, uploads it as-is to the "originals" container, generates the ~2000px WebP derivative,
     uploads that to the "web" container, and (see Decision B) writes the resulting blob path back
     somewhere the Next.js app can read it.
   - **Direct upload to Azure** (editors upload to Azure directly via some tool, bypassing
     Contentful Assets for images entirely): no webhook needed, but Contentful then only stores a
     path/slug convention as plain text, and whatever uploads to Azure is responsible for producing
     both the original and the resized derivative at upload time.
3. **Resize function**: an Azure Function (blob-triggered on the "originals" container, if you go
   with the webhook shape above) that reads the uploaded original and writes a ~2000px-wide WebP
   version to the "web" container. (Library choice — e.g. `sharp` in a Node.js Function — is an
   implementation detail for when you're in the Azure account; not decided here.)
4. **SAS generation**: needs an Azure Storage account key or a User Delegation Key (if using Azure
   AD auth on the storage account) available to *something* that can mint short-lived
   read-only SAS URLs scoped to a single blob in the "originals" container. Where that "something"
   lives is Decision C below — it can be the Next.js API route itself (using the Azure Storage SDK
   server-side) rather than a separate Azure resource, which is simpler and needs no new Azure
   compute.
5. **Migration of existing content**: not urgent — `galleryBlock` currently has zero live entries,
   so there's no backlog of already-published gallery images to migrate. This becomes relevant the
   moment real photos start getting added; worth deciding the ingest mechanism *before* that
   happens so nothing gets uploaded twice under two different systems.

### B. What changes in this codebase

1. **Content model** (Contentful web UI, not code): change `galleryBlock.images` from an Array of
   Asset links to whatever Decision A lands on — most likely an Array of a small linked entry type
   (e.g. `galleryImage` with a `blobPath`/`webUrl` Symbol field, an optional `alt`/`caption` Symbol,
   and enough info to derive the original's blob path for the download flow) rather than a plain
   Array of strings, so each image can still carry per-image metadata (alt text) the way the
   current `FlattenedAsset` shape does. This is the biggest structural decision — see Decision A.
2. **`src/types/blocks.types.ts`**: `GalleryBlockType.images` changes shape to match whatever the
   new content type looks like (no longer `FlattenedAsset[]` sourced from `keepFieldsOnly`, unless
   you keep Contentful Asset links for *display* and only move *originals* to Azure — see
   Decision D).
3. **`src/third-party/services/contentful-service.ts`**: `getEntries`'s generic
   `keepFieldsOnly`-based flattening won't need to change *if* the new gallery entries are still
   plain Contentful fields (Symbols/links to a small entry type) — the existing generic adapter
   already handles that shape for free. No new Contentful-side fetch code should be needed beyond
   what exists, assuming you don't invent a second bespoke multi-step lookup (the codebase already
   has one precedent for that, in `getFactSheetGroups`/`getPageByUrl`'s locale-merge logic — reuse
   that pattern's *shape* if a similar two-step lookup turns out to be needed, don't invent a third
   one-off variant).
4. **`src/components/GalleryBlock/GalleryBlock.tsx`**:
   - Thumbnails and the lightbox's slide `src` point at the **web WebP URL** (Azure), not
     `image.url` from Contentful.
   - The per-thumbnail Download link and the lightbox's `Download` plugin stop being a static
     `href` to a public URL. Both need to call a new API route to get a fresh SAS URL, then
     navigate to it (or trigger the browser download from it) — this is a real behavior change,
     not just a URL swap, because the current `<a href download>` pattern assumes a permanent,
     public URL, which a SAS URL by design is not.
5. **New API route**, e.g. `pages/api/gallery/download.ts` (or similar):
   - Reads the same `partners-auth` cookie `proxy.ts` uses (see Gap 6) and rejects with 401 if
     absent/invalid — **do not assume `proxy.ts` protects this**, verify it explicitly in the
     handler, matching the check already in `verifyPassword`/cookie value pattern in
     `src/helpers/auth.ts`.
   - Given a blob path/id (from the request), uses the Azure Storage SDK server-side (secret key
     never sent to the client) to generate a short-lived (e.g. 5–15 minute) read-only SAS URL for
     that specific original blob, and returns it (302 redirect, or JSON the client then navigates
     to — pick one, either works with `yet-another-react-lightbox`'s `Download` plugin if it's
     given a URL-resolving function instead of a static URL, needs checking against the installed
     plugin's API).
6. **`next.config.ts`**: add the Azure Blob (or CDN/Front Door) hostname to `images.remotePatterns`
   — the exact hostname depends on the storage account/CDN setup from Section A, so this is a
   one-line change you'll fill in once that exists.
7. **Contentful webhook handler** (if you go with the webhook ingest shape): a new API route (e.g.
   `pages/api/webhooks/contentful-asset-published.ts`) that Contentful calls on asset publish. This
   route's job is narrow: validate the webhook's authenticity (Contentful supports a shared-secret
   header — decide and store one), then either forward to the Azure Function or do the
   download-from-Contentful-CDN → upload-to-Azure work itself. Doing it in the Azure Function
   instead (per Section A) keeps this Next.js route thin — recommended, but flagged as Decision E.

### C. Env vars / secrets

All server-side only (never `NEXT_PUBLIC_*` — these must not reach the client bundle):

```
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=        # or a User Delegation Key setup, if avoiding a long-lived account key
AZURE_STORAGE_CONTAINER_ORIGINALS=
AZURE_STORAGE_CONTAINER_WEB=
AZURE_SAS_TTL_MINUTES=            # e.g. 10 — how long a generated download link stays valid
CONTENTFUL_WEBHOOK_SECRET=        # only if the webhook shape is chosen (Section A/B.7)
```

Add these to `env.template` (placeholders only, matching the existing pattern where
`PARTNER_PASSWORD`'s template line has a comment explaining what it holds) once the actual Azure
resources exist — no point adding real names for resources that don't exist yet.

### D. Order of operations, and what's testable without Azure access

1. **Now, no Azure needed**: decide Decisions A–E below. Nothing else should start until these are
   settled, since they change the shape of the content model and the API route.
2. **Now, no Azure needed**: update the Contentful content model for `galleryBlock` per Decision A,
   and update `GalleryBlockType`/adapter usage to match — testable locally against Contentful alone,
   exactly like every other content-model change made so far in this project (create the type in
   the Contentful web UI, verify field names via a throwaway script hitting the CDA, then write the
   TypeScript type and component changes against the *real* schema — the established pattern in
   this repo, not a guess).
3. **Needs an Azure account**: create the storage account + containers, and the ingest mechanism
   (webhook + Function, or direct-upload tooling). This is the first step that can't be tested
   without Azure access.
4. **Needs an Azure account + at least one test blob**: write and test the SAS-generation API
   route against a real blob. Can be developed against a manually-uploaded test image before the
   full webhook/Function pipeline exists — i.e., you don't need the ingest automation working yet
   to build and test the *download* half.
5. **Needs both sides working**: wire `GalleryBlock.tsx` to the web-WebP URLs and the new download
   route, add the Azure hostname to `next.config.ts`, end-to-end test with a real gallery entry.
6. **Last**: build/test the webhook → Function → both-containers pipeline for new Contentful asset
   publishes, so future uploads are automatic rather than manual.

---

## 4. Decisions to make before implementation

- **Decision A — where do editors upload images going forward?**
  - (A1) Keep uploading into Contentful Assets as today; a webhook mirrors every publish to Azure
    (both original and resized WebP), and the app is changed to render/link the Azure copies
    instead of the Contentful ones. Editor workflow doesn't change at all. Contentful still holds a
    copy of every original (bandwidth for the *editor's upload* into Contentful is unavoidable
    either way; the savings are on the *serving* side, not the authoring side).
  - (A2) Editors stop uploading to Contentful Assets for gallery photos; some other upload path
    writes directly to Azure, and Contentful only stores a reference (path/slug) as plain text.
    Contentful truly never touches the image bytes, but this needs a new upload UI/tool since the
    Contentful web UI's own asset picker no longer applies to this field.
  - This is the single decision with the biggest blast radius (content model shape, editor
    workflow, whether a webhook is needed at all) — recommend settling this first.
- **Decision B — resize at upload time vs. on-the-fly.** You already stated the target is a fixed
  ~2000px WebP, which reads as "resize once at upload/ingest time, store the derivative, serve it
  as a static file" (Section A.3) rather than resizing per-request. Confirming: is there any case
  where you'd want multiple derivative sizes (e.g. a smaller thumbnail vs. the ~2000px lightbox
  size), or is one fixed web size enough for both the grid thumbnail and the lightbox view? This
  changes whether the resize Function produces one or several derivatives per original.
- **Decision C — where does SAS generation run?** Recommend: inside the Next.js API route itself
  (server-side, using the Azure Storage SDK with the account key from env vars) rather than a
  separate Azure Function — it's one less moving Azure piece, and Next.js API routes already run
  server-side with secrets available. Flagging in case there's a reason (e.g. wanting SAS issuance
  auditable/rate-limited independently of the Next.js app) to put it in Azure instead.
- **Decision D — does `galleryBlock` keep any Contentful Asset link at all**, e.g. for a
  low-res blurhash/placeholder generated by Contentful's own Images API, or does Contentful hold
  zero image bytes/links once migrated? Affects whether `FlattenedAsset`/the adapter's asset
  flattening is still involved for gallery images at all, or whether this becomes a fully separate
  code path.
- **Decision E — webhook processing location.** Confirm the webhook handler itself should live in
  Next.js (`pages/api/webhooks/...`) just as a thin relay, with the actual download-from-Contentful
  + upload-to-Azure + resize work happening in an Azure Function — vs. doing all of that inside the
  Next.js API route directly (simpler deploy story, but ties a potentially slow, large-file
  operation to a Next.js serverless function's execution time/size limits, which are typically
  tighter than a dedicated Azure Function's).
- **Out of scope, confirm it should stay that way**: `factSheetGroup.image` (banner) and
  `factSheetGroup.file` (the PDF itself) currently follow the exact same "direct Contentful URL,
  including for download" pattern this plan fixes for gallery photos. The problem statement was
  specifically about gallery images; flagging that the PDF fact-sheets are a structurally identical
  bandwidth concern (large-ish PDFs, direct download links) in case it's meant to be addressed
  later under the same architecture, or deliberately left on Contentful.

---

**Nothing above has been implemented.** Once Decisions A–E are settled, the next step would be
Section D.1/D.2 (content model change + type updates) — say go-ahead before I touch anything.
