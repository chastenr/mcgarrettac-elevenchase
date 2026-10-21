# McGarrett A/C & Heating — homepage concepts

A local-only client presentation built with Next.js App Router, TypeScript, Motion for React, Lucide, and scoped CSS. Business copy and original assets were researched against [McGarrett’s website](https://mcgarrettac.com/). Full provenance and content boundaries are in [ASSET-SOURCES.md](./ASSET-SOURCES.md).

## Run locally

Use Node.js 22.13+ LTS or Node.js 24+ and npm.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**.

| Route       | Experience                                                                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`         | Two equally prominent concepts, with actual browser screenshots and links to each complete homepage.                                                                    |
| `/design-1` | **Precision Comfort** — deep navy, Archivo, immersive technician photography, numbered service explorer, and property segments.                                         |
| `/design-2` | **Comfort, Close to Home** — warm ivory, Lora, a layered split hero with cooling/heating choices, conversational need selector, and asymmetric editorial service tiles. |

Every route has a unique title and description and inherits `noindex, nofollow`. Nothing is deployed or connected to the company’s live website.

## Forms and interactions

Shared typed business facts live in `lib/content.ts`. The homepages remain Server Components, with focused client sections for menus, service selectors, forms, and motion. Both concepts use the same request selection context and demo form logic.

- Service/property selections populate the editable form without replacing contact details already entered.
- Validation covers required name, realistic US phone formatting, optional email, service selection, and text ZIP codes (including leading zeros).
- Inline errors, a focused error summary, visible labels, and a focused preview confirmation support keyboard and screen-reader use.
- The preview form never sends a request or stores personal details. Call and email links use the genuine business destinations. A request is never presented as a confirmed appointment.
- Inline mobile menus support Escape and focus restoration. The mobile call/request bar hides when a form control has focus and has reserved footer space and safe-area padding.
- Motion and scrolling respect reduced-motion preferences; primary content is visible immediately.

## Motion and the revised opening section

Design 2 now opens with layered company and service photography, an animated handwritten underline, a one-time line illustration, a family-business note, and a small pointer response on desktop. The cooling/heating choices change the supporting image and description, then carry the chosen service into the editable request form. Critical headings and calls to action stay visible immediately.

Both concepts have stronger once-only staggered section reveals, image settling, moving selection indicators, service/property crossfades, smooth accordions, and button/navigation feedback. Reduced-motion users receive a settled layout, and server-rendered content remains readable without JavaScript. There are no continuous decorative animation loops.

## Validation and screenshots

```sh
npm run typecheck
npm run lint
npm run build
npm run test:e2e
node tests/capture.mjs
```

The browser tests and capture script use installed Google Chrome. Install Chrome or set `PLAYWRIGHT_CHANNEL` to an installed Playwright-compatible browser for captures; the test configuration uses Chrome. With a running server, use `PLAYWRIGHT_BASE_URL=http://localhost:3001` to check a production build on another port. `PLAYWRIGHT_START_SERVER=1 npm run test:e2e` can start the development server automatically.

The 32 E2E cases check direct loading and metadata; console/runtime errors; real image loading; horizontal overflow at 320, 375, 768, 1024, and 1440 pixels; automated accessibility; route switching and browser Back; mobile navigation; service/property population and draft preservation; required and optional-field validation; honest demo confirmation without delivery or local storage; contact links and anchor destinations; keyboard service discovery; FAQs; reduced motion; and mobile form access.

Final full-page screenshots are in `screenshots/`: `selection-desktop.png`, `selection-mobile.png`, `design-1-desktop.png`, `design-1-mobile.png`, `design-2-desktop.png`, and `design-2-mobile.png`. The selection page’s actual concept captures are in `public/previews/`.

Production preview:

```sh
npm run build
npm run start -- --port 3001
```

## Presentation boundaries

No form delivery integration, analytics, external embeds, reviews, or diagnostic/quoting tools were added. The license number is a transcription from the source website, not independent verification of current license status. On-call and after-hours wording does not promise round-the-clock dispatch. Photos and branding were copied from the company site for this private presentation; underlying transfer rights were not independently established. No required visual assets are missing.

`npm audit` reports five high advisories in the development-only Next.js ESLint chain (`braces`/`micromatch`/`fast-glob`); the registry currently offers no patched compatible `braces` version. The application’s production dependency audit is clean. No forced framework downgrade was applied.

The revised hero’s heating state is also captured in `screenshots/design-2-desktop-heating.png` and `screenshots/design-2-mobile-heating.png`. The actual motion demonstration is `screenshots/design-2-motion.webm`; regenerate it against a running local server with `node scripts/capture-motion.mjs`.
