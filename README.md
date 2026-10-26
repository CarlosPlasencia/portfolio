# Carlos Plasencia — Portfolio

Bilingual personal portfolio focused on custom web development, applied AI and SaaS products. Built with Astro, React and TypeScript, with locally hosted fonts and static output.

## Run locally

Use Node.js 22.23.4 or newer and pnpm 9.15.4.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Astro. No environment variables, account credentials or backend services are required.

## Check and build

```sh
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

The build produces `dist/`. Building and previewing do not deploy the site.

Tests check bilingual content, project attribution, language resolution, metadata and the integrity of approved public assets. Browser checks are still needed for responsive layouts, keyboard interaction and language persistence.

## Edit the portfolio

| Area | Location |
| --- | --- |
| Spanish and English copy, contact links, project evidence | `src/lib/i18n.ts` |
| Language persistence and document metadata | `src/contexts/LanguageContext.tsx` |
| Home route and workspace interactions | `src/pages/index.astro`, `src/components/workspace/WorkspacePreview.tsx` |
| Workspace visual system and local fonts | `src/styles/workspace.css`, `src/styles/globals.css` |
| Server-rendered metadata and structured data | `src/layouts/Layout.astro` |
| Approved portrait, CVs and Financialia cases | `public/` |

Spanish is rendered on the server. On hydration, a valid saved language preference takes priority over the browser language; unsupported languages fall back to Spanish. Switching remains available if browser storage is blocked.

## Selected work

- **Financialia:** own product developed independently through Totora Studio; voice/text input, Claude integration, server-side validation and user confirmation.
- **DGF Inmobiliaria:** client website designed, developed and deployed independently, including configurable content and management modules.
- **Maki Panda:** independent client delivery with a configurable menu, loyalty program and location-specific ordering links.
- **Skillramp:** Aptura Labs product; architecture and development leadership with a multidisciplinary team, not a solo implementation.
- **ReservaYa:** own scheduling and payments product.

Project artwork is a typographic presentation, not a screenshot of the products. Client and product source code is not part of this repository. The included portrait and PDFs are personal portfolio materials; no open-source license has been selected for them or this source.

## Workspace home page

Open `/` on the local server to use the workspace design as the main page. The home route retains the canonical URL, social metadata and structured data. `/workspace` remains a separate noindex preview of the same interface; nothing has been published. Browse the biography, projects, core skill files, additional tools and services using the explorer, search (`Cmd/Ctrl+K`) or previous/next links below each page. Pages can be revisited through their URL fragment.

Each project has its own concept illustration and a local interactive simulation: Financialia's review-gated transaction pipeline, DGF's content preview, Maki Panda's sample order/loyalty flow, Skillramp's creator/student view and ReservaYa's sample availability. Illustrations are not product screenshots; sample content and rules are not production data. Simulations make no network calls and persist nothing. Navigating away resets them.

The overview's Codex and Claude terminal sequences are illustrative, not live agent sessions. The language button switches ES/EN directly. Motion follows the system's reduced-motion preference; Financialia uses manual steps when reduced motion is enabled. The contact page lets visitors choose WhatsApp, LinkedIn, email, GitHub or Totora Studio. Email can be copied without launching a mail application. CV links open the language-specific PDF in a new tab rather than forcing a download. The `/workspace` preview remains `noindex,nofollow`; the home route retains its normal indexing metadata. Neither route has been published by this local change.

## Toolchain maintenance

Astro 7 and its React integration run the static build. React remains on version 18 and Tailwind on version 3 to preserve the current rendering and visual system. Tailwind and Autoprefixer are configured directly through Vite PostCSS; the legacy Astro Tailwind integration is not compatible with this Astro release. Existing Tailwind directives provide the base styles once. Default client chunking replaces the removed Rollup manual-chunk configuration.

Use `pnpm audit` after dependency updates, then run the checks above and inspect desktop/mobile interactions in a browser. An audit result describes known registry advisories, not a guarantee that every vulnerability has been discovered.

Two consumer-specific pnpm overrides pin `postcss-selector-parser` to 7.1.6 for Tailwind 3.4.19 and postcss-nested 6.2.0 (GHSA-rj75-hqrm-r3gf). This intentionally exceeds their declared 6.x ranges; it is a tested compatibility workaround, not an upstream-supported range. The selector regression test pins pre-override CSS semantics for responsive/dark/interaction/arbitrary variants and `@apply`. Revalidate these pins when upgrading either consumer; do not broaden them globally.
