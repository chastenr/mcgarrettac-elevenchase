# Verification record

Completed locally on 21 October 2026 (Asia/Manila). No deployment or live business request was made.

| Check                           | Actual result                                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                  | Passed, no lint errors or warnings.                                                                                                                                                                 |
| `npm run typecheck`             | Passed.                                                                                                                                                                                             |
| `npm run build`                 | Passed; `/`, `/design-1`, and `/design-2` prerender as static routes.                                                                                                                               |
| Production-server browser suite | **32 passed in 11.3 seconds**, using installed Google Chrome against `http://localhost:3001`.                                                                                                       |
| Responsive checks               | All three routes fit 320, 375, 768, 1024, and 1440px without horizontal overflow.                                                                                                                   |
| Automated accessibility         | No serious or critical WCAG A/AA violations on any of the three routes in the automated desktop scan. This is an automated check, not an accessibility certification.                               |
| Images                          | Displayed logos, photos, and actual concept previews load on every route.                                                                                                                           |
| Navigation                      | Direct routes, both selection links, concept switching, browser Back, in-page anchors, mobile menus, Escape, and focus restoration passed.                                                          |
| Request flows                   | Both forms preserve entered contact details when service/property choices change; validation and exact demo confirmation passed. No request delivery or personal-data local-storage write occurred. |
| D1 service discovery            | Desktop arrow-key service navigation and intent panel passed; mobile heating accordion and form prefilling were also exercised manually in the browser.                                             |
| D2 service discovery            | Need selection and property changes populate the editable form and preserve contact details.                                                                                                        |
| Motion                          | Reduced-motion checks passed. Additional normal-motion browser passes across all three routes returned no runtime or console errors.                                                                |
| Mobile quick actions            | Genuine call destination; hides while form controls are focused; reserved bottom space and safe-area padding.                                                                                       |
| Production dependencies         | `npm audit --omit=dev`: zero vulnerabilities. Development-only ESLint dependency advisories are documented in README.                                                                               |

## Visual review

Reviewed desktop and mobile rendered pages, the 320px and tablet layouts, the D1 service explorer and property section, authentic photo crops, the contact sections, and complete footers. Corrected a 320px D2 headline overflow, secondary-text contrast, an image path, a reduced-motion hydration mismatch, the favicon request, and mobile bar spacing before completion.

The animation revision adds browser checks for the hero cooling/heating choices, keyboard use, preserved contact/property details, settled reduced-motion rendering, and readable primary content without JavaScript on both concepts. A decorative illustration overflow at tablet width was corrected before the final run.

Final screenshots were captured from the production server with reduced motion enabled and lazy images loaded. Selection preview JPGs use the real implemented homepages at 1440 × 1240px; desktop full-page PNGs use 1440px width and mobile PNGs use 375px width.

- [Selection — desktop](./screenshots/selection-desktop.png)
- [Selection — mobile](./screenshots/selection-mobile.png)
- [Design 1 — desktop](./screenshots/design-1-desktop.png)
- [Design 1 — mobile](./screenshots/design-1-mobile.png)
- [Design 2 — desktop](./screenshots/design-2-desktop.png)
- [Design 2 — mobile](./screenshots/design-2-mobile.png)

Forms remain deliberately in preview mode. No required images are missing, and no live delivery integration is configured. Image provenance and the boundaries of source-site photo rights are recorded in [ASSET-SOURCES.md](./ASSET-SOURCES.md).

The revised Design 2 heating state is captured separately at desktop and mobile sizes. [Motion demonstration](./screenshots/design-2-motion.webm) records the actual hero entrance, comfort switches, subtle pointer response, and transition into the service selector with normal motion enabled. The capture completed without browser runtime errors.
