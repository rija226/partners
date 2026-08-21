# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`partners-site` is a from-scratch rebuild of the real Plava Laguna Partners portal (hotels/
apartments/campsites + fact-sheet downloads, behind a login, bilingual en/hr — same brand/content
as the reference `partners web` project, not a hypothetical). Built so far: login page, auth
(bcrypt + cookie gate), Header (accommodation + language dropdowns), Footer, i18n plumbing, a
working Contentful-driven page (`pages/index.tsx` renders whatever `page` entry's `content` array
holds via `ComponentMapper` — currently just a `RichText` block), and a CMS-driven accommodation
dropdown (fetches real `accommodationObject` entries, grouped by category). Not built yet:
per-category listing pages and per-property detail pages (`unitsPage.url` on each accommodation
entry already points at where those should live, e.g. `/accommodation/hotel-parentium/details/` —
those routes 404 until built) and fact-sheet content.

**`../partners-site-blueprint.md`** (one directory above this one, at the repo root) is background,
**not a spec to follow 1:1** — the user has explicitly said the real Contentful content model will
diverge from it (see "Real Contentful content model" below) and that only the general structure/
foundations matter, not exact parity. Use it for the *shape* of ideas (generic-fetch-plus-adapter
pattern, page-builder/ComponentMapper pattern, fail-fast on unknown content types) but always verify
actual field/content-type names against the live Contentful space before writing code — don't
assume the blueprint's names are what's really there.

Key things the blueprint is explicit about:
- **Pages Router, not App Router.** Do not introduce an `app/` directory.
- **Architecture is ported from two external reference projects** (`Istria_Experience` and
  `partners web`, not part of this repo) — the blueprint tells you what to port 1:1 vs. what to
  change (e.g. section 7's note on fixing a 404-vs-empty-fallback bug from the original, section 9's
  choice to `throw` on unknown content types instead of `console.warn`).
- **YAGNI is deliberate, not an oversight.** The blueprint has an explicit "what we do NOT build"
  list (Google Maps, booking widget, GTM/Cookiebot, blog, newsletter, test suite, several npm
  packages the production app uses for features this portal doesn't have). Don't add these back
  without checking with the user first — their absence is a documented decision, not a gap.
- **Dependencies are added incrementally per section 2** — `react-hook-form`,
  `yet-another-react-lightbox`, `@netlify/plugin-nextjs` etc. are called out as "install only when
  actually needed," not upfront.

## Commands

```bash
npm run dev                     # next dev
npm run build                   # next build
npm run start                   # next start
npm run lint                    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npm run check-auth              # tsx scripts/check-auth.ts — assert-based self-check for verifyPassword/bcrypt
npm run generate-password-hash  # node scripts/generate-password-hash.js <password> — prints a bcrypt hash for .env.local
```

There is no test runner and none should be added preventively — neither the production reference
app nor the current portal this replaces has one (blueprint section 1). `check-auth` is a one-off
assert script, not a test suite — don't grow it into one; it exists because auth is a security path.

Once the i18n build scripts described in the blueprint (section 10) exist, `predev`/`prebuild` will
run `cleanup-translations` then `generate-translations` before `dev`/`build` — these don't exist
yet in `package.json`.

## Brand rules

- **No `border-radius`, anywhere.** Sharp corners only — must be `0` (or omitted) on every element,
  including badges/pills that would otherwise be rounded (e.g. the fact-sheet language badges are
  sharp rectangles, not pills). Not a style preference — don't round corners on new components even
  if a design reference (screenshot, the `partners web` codebase) shows rounded ones.
- **No dark mode.** `styles/globals.css` originally had create-next-app's default
  `prefers-color-scheme: dark` media query, which set the page background to near-black (`#0a0a0a`)
  on a dark-mode OS/browser — removed, since the brand has exactly one fixed light palette
  (`src/styles/theme.ts`) and no dark variant. If a "why is X black/dark" question comes up again,
  check for a reintroduced `prefers-color-scheme` block before assuming it's a component bug.
- **`Header` is `position: fixed`, not `sticky`** (`Header.style.ts`). Sticky was tried first, plus
  an `overflow-y: visible` fix on `html`/`body` in `globals.css` for the known
  overflow-x-implies-overflow-y-auto gotcha — still didn't stick in the user's real browser (SSR
  HTML had the right CSS, so it was a live-rendering issue, not a markup/build bug). Switched to
  `fixed` (`top/left/right: 0`) since it doesn't depend on any ancestor's `overflow` being exactly
  `visible` — nothing in the ancestor chain can silently undo it. Because `fixed` removes Header
  from document flow entirely, `Layout.style.ts`'s `Main` has `padding-top: 5rem` (matching
  `Header.style.ts`'s `Bar` height) so page content doesn't render underneath it — if Header's
  height ever changes, update both places together. `globals.css` still keeps the explicit
  `overflow-y: visible` fix (harmless, still correct practice), it just wasn't sufficient alone.

## Stack

Next.js 16 (Pages Router) · React 19 · TypeScript 5 (strict) · styled-components v6. Core
dependencies from blueprint section 2 (`contentful`, `next-i18next`/`react-i18next`/`i18next`,
`bcryptjs`, `cookie`, `fs-extra`, `tsx`) are already installed, plus `yet-another-react-lightbox`
(added once the gallery lightbox was actually needed — see below). Not yet installed, and per the
blueprint only add when actually needed: `react-hook-form`, `@netlify/plugin-nextjs`.

Path aliases configured (`tsconfig.json`): `@/*` → project root, `@helpers/*` → `src/helpers/*`,
`@components/*` → `src/components/*`, `@adapters/*` → `src/adapters/*`,
`@third-party/services/*` → `src/third-party/services/*`. Still missing (add if/when mock data is
introduced): `@mocks/*`.

**`next-i18next` v16 (the version actually installed) restructured its exports** — this is a real
breaking change vs. the blueprint's examples (written against an older version), not something to
guess around: for Pages Router, import `appWithTranslation`/`useTranslation` from
`next-i18next/pages` and `serverSideTranslations` from `next-i18next/pages/serverSideTranslations`
— *not* from the bare `"next-i18next"` package root (that now resolves to the App Router build and
lacks these exports). Check `node_modules/next-i18next/package.json`'s `exports` map if something
doesn't resolve.

**Next.js 16 renamed Middleware to Proxy.** The auth gate lives in `proxy.ts` (project root),
exporting a function named `proxy`, not `middleware.ts`/`middleware`. `node_modules/next/dist/docs/`
has real, current Next.js 16 docs bundled in this install — genuinely useful to check for
breaking-change questions like this one (verify against it, don't rely on training-data assumptions
about Next.js APIs, since this project intentionally tracks a very new major version).

**`@types/styled-components` must NOT be installed** — styled-components v6 (what's used here)
ships its own types; the old `@types/styled-components` package (for v5) conflicts with the
`DefaultTheme` augmentation in `src/styles/styled.d.ts`. If `npm install` ever pulls it back in as a
transitive/accidental dependency, remove it again.

**Two gotchas hit and fixed while building the auth gate, both confirmed by actually testing the
running server, not just reading code:**
- **`proxy.ts`'s negative-lookahead matcher doesn't match the bare root path `/`.** The pattern
  `"/((?!_next/static|...).*)"` matches `/login`, `/hotels`, etc. but silently skips `/` itself, so
  the auth gate never ran on the homepage. Fix: add a second literal `"/"` entry to the `matcher`
  array (already done in `proxy.ts`) — this is the exact same fix the reference `partners web`
  project's old `middleware.ts` already had (its comment literally says "Explicitly match root
  path"). If you ever rewrite the matcher, keep both entries.
- **`$` in a bcrypt hash gets mangled by Next's env loader.** `@next/env` runs dotenv-expand, which
  treats `$2b`, `$10`, etc. inside `PARTNER_PASSWORD` as variable interpolation and silently strips
  everything up to the last `$`. Fix: escape every `$` as `\$` in `.env.local`.
  `scripts/generate-password-hash.js` now prints the already-escaped value — always paste that
  printed line verbatim, never the raw `bcrypt.hash()` output, into `.env.local`.

## Decisions already made (don't re-ask)

The blueprint leaves a few things open for the user to decide (sections 6, 11, 15). These are settled:

- **Contentful space:** new empty space, Space ID `hp207eki9nx1` (in `.env.local`). Content model
  (section 6) still needs to be created manually in the Contentful web UI — not done yet.
- **Header/Footer:** static React components, not CMS-driven. Do not create `header`/`footer`
  content types.
- **Auth:** bcrypt hash, not plain-text comparison. `PARTNER_PASSWORD` in `.env.local` must hold a
  bcrypt hash (generate via a `scripts/generate-password-hash.js`, ported from `partners web`), and
  `verifyPassword` must call `bcrypt.compare`.
- **Auth cookie name:** `partners-auth`.

Still outstanding (need a value from the user before auth/Contentful actually work end-to-end):
`CONTENTFUL_DELIVERY_TOKEN` and `PARTNER_PASSWORD` are blank in `.env.local` — fill directly in that
file (gitignored), don't ask for them to be pasted in chat since they're secrets.

## Real Contentful content model (verified against the live space, not the blueprint's guesses)

The blueprint assumed field/content-type names that turned out wrong. What's actually in the space
(Space ID `hp207eki9nx1`) as of the last check — **re-verify with a throwaway script hitting the CDA
before assuming this is still accurate**, since the user is actively adding to it:

```
page         → displayName, seoMetaData (ref -> seoMetaData), content (array; currently only
                validated to link richText entries in the Contentful UI — extend that validation
                there before adding new page-builder component types)
richText     → displayName, adaptiveContent (Contentful RichText field, an AST — render with
                @contentful/rich-text-react-renderer's documentToReactComponents, don't hand-parse it)
seoMetaData  → displayName, url, seoTitle, seoDescription
```

Note the blueprint called this content type `seoHead` with fields `title`/`description` — the real
one is `seoMetaData` with `seoTitle`/`seoDescription`. Every content type here also has a
`displayName` field (CMS-author-facing label) that the blueprint didn't anticipate.

```
accommodationObject → displayName, name, description, type (enum: "Hotel" | "Apartment" | "Villa" |
                        "Classic Camping" | "Mobile Home" | "Glamping" | "Naturist" — this is the
                        category discriminator, one content type covers all accommodation kinds,
                        not per-category content types), featuredImage (Asset), starRating (1-5),
                        overallRating (1-5), location ("Poreč" | "Umag"),
                        vacationType ("All inclusive" | "Family" | "City"), address,
                        seoMetaData (ref -> seoMetaData — `seoMetaData.url` doubles as the route to
                        THIS property's own detail page; there is deliberately no separate
                        "unitsPage"-style field, that was a since-removed duplicate)
```

`src/types/accommodation.types.ts` has the full `Accommodation` type. This was a deliberate design
choice (discussed with the user, not assumed): one content type with a `type` discriminator rather
than six separate content types, matching the pattern already proven in the `partners web`/
`Istria_Experience` reference projects (`Hotel` type with a `type` field).

## Architecture notes (what's actually implemented)

- **`Header` was already `position: sticky; top: 0`** (`Header.style.ts`) since it was first built —
  stays pinned on scroll without any further work needed.
- **`ScrollToTopButton`** (`src/components/ScrollToTopButton/`) — fixed bottom-right button, only
  rendered once `window.scrollY > 400`, `window.scrollTo({ top: 0, behavior: "smooth" })` on click.
  Lives in `Layout.tsx` (renders on every page, like Header/Footer), not per-CMS-block — this is
  site chrome, not page-builder content, so it isn't a Contentful content type or registered in
  `ComponentMapper`.
- **Contentful access is a single generic fetch** (`getEntries` in
  `src/third-party/services/contentful-service.ts`) wrapped by thin, typed functions per content
  type (currently just `getPageByUrl`) — never add a second Contentful client or bypass the generic
  fetch.
- **`getPageByUrl` does a two-step lookup**: find the `seoMetaData` entry by `fields.url`, then find
  the `page` entry that links to it via `fields.seoMetaData.sys.id` — Contentful can't filter a
  content type by a nested reference's own fields in one query, only by the linked entry's ID.
- **`keepFieldsOnly` adapter** (`src/adapters/contentful-response.adapter.ts`) generically flattens
  any entry's `fields`, recursively flattening nested Entry links and Asset links (asset URLs get the
  `https:` prefix added here) — there are no per-type parsers yet (no `picture`/`internalLink`
  content types exist), add a parsers map only when a content type needs shaping beyond plain
  flattening.
- **`ComponentMapper`** (`src/components/Layout/ComponentMapper/ComponentMapper.tsx`) maps a
  `page.content` array to React components by `sys.contentType.sys.id`, capitalized to look up
  `COMPONENT_MAP`. Throws on an unregistered content type — fail-fast is deliberate, add a row to
  `COMPONENT_MAP` (and the `RichText`-style component) as soon as a new content type is added in
  Contentful.
- **No `unstable_cache`/cache-tag machinery** — that's an App Router-era pattern the blueprint
  assumed; this is Pages Router, so `getStaticProps` + a plain `revalidate: PAGE_REVALIDATE` (300s
  ISR) is the whole caching story. Don't reintroduce `next/cache` here.
- **No barrel (`index.ts`) files for components.** Import the concrete file directly
  (`Card/Card`, not `Card/index`), matching the reference projects.
- **`src/types` intentionally has no path alias** — use relative/absolute imports there, unlike the
  other `src/*` folders.
- **Hotel/apartment/campsite content types don't exist yet.** The blueprint's notes on
  list-fetchers-vs-single-item mock-data fallback behavior (section 7) apply once that work starts,
  not yet — don't build against content types that aren't in the space.
- **`pages/[...slug].tsx`** is the generic CMS-page catch-all: `getStaticPaths` returns `paths: []` +
  `fallback: "blocking"` (nothing enumerated at build time — every URL resolves and gets ISR-cached
  on first request, so a newly published Contentful `page` shows up without a rebuild).
  `pages/index.tsx` and `[...slug].tsx` both render through the shared
  `src/components/CmsPage/CmsPage.tsx` (Head from `seoMetaData` + `mapComponents(page.content)`) —
  don't duplicate that rendering logic into a third place, extend `CmsPage` instead.
- **Contentful URLs are stored with a trailing slash** (`"/"`, `"/accommodation/hotel-parentium/"`),
  but Next's default routing 308-redirects a trailing-slash request to the canonical no-slash form.
  Two places this matters: (1) `[...slug].tsx`'s `getStaticProps` re-appends a trailing slash when
  reconstructing the lookup URL from `params.slug` to match Contentful's stored format; (2) any
  component that turns a CMS `seoMetaData.url` into a `href` should strip the trailing slash first
  (see `toHref` in `AccommodationDropdown.tsx`) to avoid an unnecessary redirect hop on every click.
- **Accommodation dropdown is CMS-driven, fetched client-side.** `pages/api/accommodations.ts` wraps
  `getAccommodations()`; `AccommodationDropdown` fetches it once on mount (`useEffect`) rather than
  via `getStaticProps`, deliberately — Header/Footer render on every page, and Pages Router has no
  clean way to share one server-side fetch across all pages without threading props through every
  page's own `getStaticProps` or disabling automatic static optimization. Revisit only if this
  causes a real problem (e.g. flash-of-empty-menu becomes annoying) — don't add SWR/react-query for
  this single one-shot fetch.
- **`AccommodationDropdown` is a full two-panel mega-menu**, not a flat link list (upgraded once
  real multi-category/multi-location data existed — matches the `partners web` reference's mega-menu
  design, requested explicitly by the user from a screenshot). Left panel: category buttons
  (`CATEGORY_ORDER`), click sets `selectedCategory` — doesn't close the menu or navigate. Right
  panel: `groupByLocationAndRating()` (local to the component, not shared/exported — only one
  consumer) buckets the selected category's items by `location` then by `starRating` (descending).
  Items with no `location` set still render, grouped under an empty-string bucket (no location
  prefix in the heading) rather than being silently dropped — "Hotel Parentium" currently has no
  `location` set and is the live test case for this path.
- **`pages/accommodation/index.tsx` is the single listing page for every category** — not one page
  per category (`/hotels`, `/apartments`, etc.). Filters (`type`, `stars`, and `location` — the
  latter only reachable via a dropdown link today, no dedicated UI control for it) are query params
  on this one route, read from `router.query` and applied client-side over the full
  `getAccommodations()` list `getStaticProps` already fetched — there's no per-filter refetch.
  `AccommodationDropdown`'s `categoryHref()` builds links into this page
  (`/accommodation?type=Hotel`, optionally `&location=Poreč`); "All accommodation" links to
  `/accommodation` with no filters. Because filtering happens client-side after hydration, the
  static/SSR HTML is always the full unfiltered list — don't expect `curl`/raw-HTML checks against
  a `?type=` URL to show filtered results, only an actual browser (or router.query-aware test) will.
  Note: `pages/accommodation/index.tsx` (exact path) and `pages/[...slug].tsx` (catch-all, handles
  `/accommodation/hotel-parentium` etc.) coexist without conflict — Next resolves the more specific
  static route first.

### `factSheetGroup` — the one content type using Contentful's native localization

```
factSheetGroup → displayName, title (localized), subtitle (localized, Text), description
                  (localized, Text), image (Asset), updated (Date), file (localized, Asset,
                  restricted to attachment/pdfdocument mimetypes), fileDescription (localized,
                  Symbol), order (Integer)
```

This is the **only** content type so far with `localized: true` fields, using Contentful's own
locale system (space locales: `en-US` default, `hr` with fallback to `en-US` — confirmed via
`client.getLocales()`, don't assume next-i18next's `"en"/"hr"` codes are the same strings
Contentful uses). Two consequences that don't apply anywhere else in the codebase yet:

- **`getFactSheetGroups(siteLocale)`** (`contentful-service.ts`) fetches the content type *twice* —
  once per locale — because the rendered section always shows **both** the EN and HR download side
  by side regardless of the site's current language, so both locales' `file` field are needed
  simultaneously. The non-`file` fields (title/subtitle/description) come from whichever fetch
  matches `siteLocale`, which already has Contentful's server-side fallback applied. This bypasses
  `keepFieldsOnly`'s recursive nested-entry flattening for `file` specifically — don't try to make
  the generic single-fetch `getEntries` handle this, the two-values-at-once requirement doesn't fit
  its shape.
- **`getPageByUrl` post-processes `page.content`** after its normal fetch: if any content item's
  content type is `factSheetGroup`, it re-fetches via `getFactSheetGroups(locale)` and swaps the
  richer (both-locale) version in, because the generic single-locale fetch used for the rest of
  `page.content` would otherwise only capture one locale's `file`. If a third content type ever
  needs similar multi-locale handling, generalize this — right now it's a targeted fix for one type.
- **`page.content`'s Contentful validation** now allows `richText`, `factSheetGroup`,
  `galleryBlock`, `infoCard`, `quickFactsBadges`, `downloadLink`, `card`, `amenities` (widened by
  the user in the Contentful web UI as each content type was added — check current validation with
  a throwaway script before assuming this list is still complete).
- **The `withAllLocales.getEntries()` / `locale: '*'` gotcha**: the installed `contentful` SDK
  version rejects `locale: '*'` outright (throws `ValidationError`) — that syntax is deprecated.
  Fetch each locale explicitly instead (`{ locale: "en-US" }`, `{ locale: "hr" }`), which is what
  `getFactSheetGroups` does; don't reach for `client.withAllLocales` unless a genuine "give me every
  locale of every field at once" need comes up.

Two more real bugs found by actually rendering a page with a `factSheetGroup` embedded (a PDF
asset, not an image — the first non-image asset the adapter had ever flattened):

- **`FlattenedAsset`'s fields must be `null`, never `undefined`.** A PDF asset has no
  `details.image`, so `width`/`height` (and any other absent field) came back as `undefined` from
  `flattenAsset`. Next's `getStaticProps` prop serialization throws on `undefined` (rejects it
  outright, `null` is fine) — this doesn't surface until a page actually renders an asset lacking
  some field, which images always have (width/height) but PDFs/other files don't. `FlattenedAsset`'s
  type is `string | null` / `number | null` etc. (not `?:` optional-undefined) precisely so this
  can't silently regress — if you add a new optional field to `flattenAsset`, coalesce with `?? null`,
  not leave it as a bare possibly-`undefined` expression.
- **`next.config.ts` needs `images.remotePatterns` for `images.ctfassets.net`.** Any `next/image`
  pointed at a Contentful asset URL throws ("hostname not configured") without this — already added,
  but if a different asset host ever appears (e.g. a separate CDN), it needs adding here too.

`FactSheetGroup.style.ts`'s `Hero` takes a `$hasImage` prop: with an image it's the original 18rem
photo hero with a dark gradient overlay; without one (per explicit request) it still renders — title
and "Updated" badge must stay visible either way — just shorter (6rem) with a flat `theme.colors.primary`
background standing in for the missing photo, no overlay needed since the text already has contrast.
`TwoColumnBlock` (below) reuses this same `Hero` component and always passes `$hasImage={false}`,
since that content type has no `image` field at all.

## Hotel detail page — page-builder blocks + the accommodation hero

The hotel detail page (e.g. `/accommodation/hotel-parentium`) is just a `page` entry like any
other — same `CmsPage`/`ComponentMapper` machinery as the homepage, no special-cased "hotel page"
route. What makes it look like a hotel page is which content types are embedded in that specific
`page.content` array:

- **`quickFactsBadges`** (`highlights: string[]`) → `QuickFactsBadges` component, the badge row.
- **`infoCard`** (`additionalInfo1/2/3: RichText`) → `InfoCard` component, up to 3 boxes. Each
  box's own heading (Pets/Check-in-out/Contact) is a heading node *inside* that box's RichText
  content, not a separate CMS field or a hardcoded prop — don't add a title field for this, it's
  already there.
- **`card`** (`displayName`, `title` (localized), `show: "1"|"2"|"3"`, `column1-3Title` +
  `column1-3Text: RichText`) → `Card` component, the dark-header multi-column detail groups
  (Location & Nearby, Dining, etc.). Renders `title` as the header text, not `displayName` —
  `title` was added after `displayName` turned out to need to be localized/editable separately
  from the CMS-internal label; every other content type still uses `displayName` as internal-only.
  `show` controls how many of the 3 column slots actually render.
- **`amenities`** (`amenities: string[]`) → `Amenities` component, bottom badge row with a heading.
- **`galleryBlock`** (`images: Array<Asset>`) → `GalleryBlock` component: a grid of thumbnails
  (each still has its own Download link) that open a `yet-another-react-lightbox` modal on click,
  with Counter (position indicator), Download, and Zoom plugins — same plugin set as the
  `partners web` reference. Clicking any thumbnail opens the lightbox at that image; it navigates
  across the *whole* gallery from there, not just that one image. Each thumbnail's caption is
  `image.title || image.description || image.fileName` (whichever is set on the Contentful Asset) —
  not a running index number, which is what it originally showed before the user asked for the
  image's own name/description instead.
- **`downloadLink`** exists as a content type but is **not wired to anything** — the user said they
  aren't sure yet how they'll use it. Don't guess and wire it up speculatively.
- **`awardsCertifications`** (`title`, `slides: Array<Link->recognitionSlide>`) →
  `AwardsCertifications` component: a horizontal slider (Holiday Check / Service.LAB style award
  badges). Deliberately **no carousel/slider dependency** — plain CSS `overflow-x: auto` +
  `scroll-snap-type: x mandatory` on the track, two buttons calling `scrollBy()` on a ref, arrow
  disabled-state driven by `scrollLeft`/`scrollWidth` on scroll. This is a simple enough interaction
  that a library (`embla-carousel`, `keen-slider`, etc.) would be over-engineering — don't reach for
  one here unless a real requirement (infinite loop, autoplay, multi-row) shows up that plain
  scroll-snap can't cover. Each `recognitionSlide` (`image`, `title`, `description`) needs zero
  special fetch handling — it's a plain nested Entry link, the existing generic
  `keepFieldsOnly` recursion already flattens it, same as every other content type here.
- **`banner`** (`displayName`, `image` — that's it, no title/subtitle) → `Banner` component: a
  full-bleed hero image. Confirmed with the user: the "GREAT SERVICE IS OUR STANDARD" /
  "PARTNER PORTAL" text visible on it is baked into the image file itself, not rendered by the
  component — don't add title/subtitle fields or text-overlay markup for this content type unless
  the user explicitly asks. `Banner.style.ts`'s `Wrapper` uses the `width:100vw` +
  `margin-left:calc(-50vw + 50%)` trick to break out of `CmsPage.Wrapper`'s `max-width:1200px` and
  span the full viewport width — the only content type so far that needs to escape that container;
  everything else intentionally stays within it.
- **`introCard`** (`displayName`, `title?`, `description?`) → `IntroCard` component: a prominent
  left-accent-bordered intro/tagline block (e.g. "THE NEW TRADITION" on the homepage). `description`
  is a plain **Text** field, not RichText — `IntroCard.tsx` splits it on `\n` into paragraphs itself
  rather than routing it through the shared `RichText` component (which expects an actual Contentful
  RichText `Document`, not a string). This was a deliberate new-content-type-vs-reuse-`richText`
  decision: `richText`'s own `adaptiveContent` field is used elsewhere as plain unstyled body text
  (the homepage's own placeholder paragraph, Hotel Parentium's "Test test"), so adding a style toggle
  to it risked visually changing that existing content — a dedicated type matches how every other
  visual block here already works (one content type per block, never a shared type plus a style flag).
- **`twoColumnBlock`** (`displayName`, `title?` localized, `description?` RichText localized,
  `file1?`/`file2?` — plain Asset links, **not** localized) → `TwoColumnBlock` component: added for
  the case where two genuinely different files need to sit side by side (e.g. a Sport map for
  Poreč and one for Umag), as opposed to `factSheetGroup`'s single `file` field which is always
  fetched from **both** Contentful locales and shown as an EN/HR translation pair of the *same*
  document. `factSheetGroup`'s hardcoded "EN"/"HR" badges were the wrong fit here — `file1`/`file2`
  are two unrelated assets, not two languages of one asset. There's no per-file label field on this
  content type, so each download card's heading comes from the Asset's own `title` (fallback
  `fileName`) and `description` metadata — set those directly on the Asset in Contentful's media
  library, not on the entry. `TwoColumnBlock.tsx` visually reuses `FactSheetGroup.style.ts`'s styled
  components directly (`Wrapper`/`Hero`/`BadgeRow`/`CardsGrid`/etc.) rather than duplicating them, so
  the two content types stay pixel-identical by construction — the one exception is `Description`,
  a small dedicated `div`-based styled component in `TwoColumnBlock.style.ts` (`factSheetGroup`'s
  `DownloadsDescription` is a `<p>`, which can't legally contain the block-level tags the RichText
  renderer produces). This content type has no `image` or `updated` field, so `Hero` always renders
  in its no-image placeholder variant (see the `factSheetGroup` bugs note above) and there's no
  "Updated" badge.

**Layout: `Card` blocks pair up two-per-row (≥1024px), every other `page.content` block is full
width.** `CmsPage.style.ts`'s `Grid`/`GridItem` (`$fullWidth` prop) decides this — `ComponentMapper`'s
`HALF_WIDTH_TYPES` set (currently just `"Card"`) is the single place that maps a component name to
half-vs-full width, don't duplicate that logic elsewhere. This went through a few iterations on how
to handle two paired `card` blocks having very different content-length (real content, user called
the mismatch "messy" from a screenshot): tried removing pairing entirely (full width, one per row),
then a fixed card height with internal scroll — landed on **letting CSS Grid's default row-stretch
do the work**: `Card.style.ts`'s `Wrapper` is `height: 100%; display: flex; flex-direction: column`
(no fixed height), `Body` is `flex: 1`. A grid item stretches to match the tallest item in its row
by default, and because `Body`'s background now fills via `flex: 1` instead of sizing to its own
content, the shorter card's extra space renders as plain background, not a blank gap below a
shorter box — explicitly fine per the user ("nije problem ako ima malo praznog prostora"), no
scrolling needed. If a third content type ever needs half-width pairing, give it the same
`height:100%; flex` treatment, not just an entry in `HALF_WIDTH_TYPES`. `Card` also has internal
columns (`show: "1"|"2"|"3"`, capped at 2 CSS columns — a half-width card is never wide enough for
a 3rd to be worth a wider breakpoint) — a separate, unrelated mechanism from this page-level pairing.

**Hero (name/location/star rating/photo) is *not* a page-builder block** — it comes directly from
the `accommodationObject` entry, not from anything in `page.content`. `getPageByUrl` does a third
lookup alongside its existing seoMetaData→page one: it also queries `accommodationObject` by the
same `fields.seoMetaData.sys.id`, since a hotel's `accommodationObject` and its `page` entry are
both linked to the *same* `seoMetaData` entry. Returns `{ page, accommodation }` (not just `page`
— this changed the return type and every caller). `accommodation` is `null` for pages with no
matching accommodationObject (e.g. the homepage), in which case `CmsPage` just skips rendering
`AccommodationHero`. This avoids duplicating name/location/starRating/photo into yet another CMS
block — don't add a redundant "hero" content type, the data already exists on `accommodationObject`.

## Deployment (Netlify)

Deployed via Netlify's Git integration (`@netlify/plugin-nextjs`, auto-detected — no `netlify.toml`
needed) to the repo at `github.com/rija226/partners`, reusing the site `partners-web.netlify.app`
(re-linked from the old reference project to this repo, same URL). Real bugs hit getting the first
deploy live:

- **Netlify secrets scanning false-positive on `PARTNER_PASSWORD`.** The scanner flagged the bcrypt
  hash's value appearing inside `@netlify/plugin-nextjs`'s own vendored Deno/Node type declaration
  files (`buffer.d.ts` under `.netlify/edge-functions/.../deno.land/...` and
  `.netlify/plugins/node_modules/...`) — these are the plugin's own bundled runtime files, not
  anything in this repo's code. Fixed by adding a `SECRETS_SCAN_OMIT_KEYS=PARTNER_PASSWORD`
  environment variable (Netlify env vars, not `.env.local`) rather than disabling the scanner
  entirely.
- **`PARTNER_PASSWORD` in Netlify must NOT have the `\$` escaping used in `.env.local`.** That
  backslash-escaping is only needed locally because `@next/env`'s dotenv-expand mangles a bare `$`
  in `.env.local` — Netlify env vars are stored literally with no shell-style expansion, so pasting
  the escaped `\$2b\$10\$...` version there breaks `bcrypt.compare` (not a valid hash anymore) and
  every login attempt fails with "Invalid password" regardless of what's typed. Always paste the
  clean `$2b$10$...` value (no backslashes) into Netlify's UI.
- **500 on every real page (e.g. `/accommodation/hotel-parentium`) despite a clean local build.**
  Netlify Function logs showed `Error: next-i18next was unable to find a user config at
  /var/task/next-i18next.config.js`. `serverSideTranslations` loads that config from disk at
  runtime (not a static import), so Next's serverless file tracer doesn't detect the dependency and
  drops it from the deployed function's bundle — works fine locally (`next dev`/`next start`, whole
  repo present) but breaks on Netlify/Vercel where only each function's traced files get deployed.
  Fixed in `next.config.ts` with `outputFileTracingIncludes: { "/**": ["./next-i18next.config.js"] }`
  — verified by checking `.next/server/pages/[...slug].js.nft.json` actually lists
  `../../../next-i18next.config.js` after the fix. If another runtime-loaded (not statically
  imported) file ever gets added, it needs adding to this same trace-include list.

## Responsive (tablet + mobile)

Breakpoints: **mobile** < 640px, **tablet** 640–1024px, **desktop** ≥ 1024px — matches the
breakpoints already used throughout (Card/CmsPage/GalleryBlock/InfoCard grid columns).

- **Header nav below 1024px is a completely different component, not a CSS-collapsed version of
  the desktop one.** `AccommodationDropdown` (desktop) is a hover-driven 3-level flyout that
  opens sideways (`left: 100%`) — there's no hover on touch and no room for a sideways flyout on
  a narrow screen, so trying to make the same component "responsive" would mean fighting its own
  interaction model. Instead: `AccommodationDropdown.Wrapper` is `display:none` below 1024px, and
  a separate `AccommodationAccordion` (tap-to-expand, stacked vertically, indented) renders inside
  `MobileMenu`'s full-screen overlay instead. Both share the same data/fetch/grouping logic via
  `useAccommodationGroups.ts` (extracted specifically for this split) — only the presentation
  differs. Same split for `LanguageSwitcher`/`SearchBox` (desktop, hidden <1024px via
  `Header.style.ts`'s `RightGroup`) vs. the language list / search form built inline inside
  `MobileMenu.tsx` (not the same components reused, since their hover/click-to-toggle-dropdown
  interaction doesn't fit inside an already-open overlay).
- **`Header.style.ts`'s `Bar` is a 3-column CSS grid (`1fr auto 1fr`), not `flex` +
  `justify-content: space-between`.** With flex space-between, `AccommodationDropdown` and
  `MobileMenu`'s hamburger toggle sharing one DOM slot (`LeftGroup`) — exactly one visible at a
  time via their own breakpoint CSS — still each reserve flex-item space when "hidden" via
  `display:none` on their *child*, not the slot itself throwing off centering of the logo in the
  middle. A grid track doesn't have that problem; the middle column is always exactly the logo's
  width regardless of what the side columns contain.
- **`AccommodationHero.Title`** loses its `white-space: nowrap` below 640px (kept ≥640px, per the
  earlier explicit "keep it on one line" request) — a long hotel name would otherwise overflow a
  phone screen. Font-size also steps down (1.375rem mobile → 2rem ≥640px).
- **`FactSheetGroup.LogoBox`** (the Plava Laguna/Istra Camping brand mark, absolutely positioned
  at the hero's right edge) is `display:none` below 640px — at 11rem wide it would overlap
  `HeroContent`'s title/badges text on a phone; it's a secondary brand mark, safe to drop there
  rather than trying to shrink/reflow it.
- **`AwardsCertifications`'s horizontal scroll-snap slider and the login page's fluid card
  (`width:100%; max-width:28rem`) already worked at any width without changes** — didn't touch
  them, don't "fix" what isn't broken here.
- Verification for this kind of work is inherently limited to what SSR HTML/build output can
  prove (markup present, no crash) — actual visual correctness at 375px/768px (does the hamburger
  overlay actually look right, does the accordion expand correctly) needs a real browser, which
  isn't available in this environment. Flag that explicitly rather than claiming full visual
  verification.
