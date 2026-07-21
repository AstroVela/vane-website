# CTA responsive title and button hover design

## Goal

Keep the Chinese closing CTA title on one line at desktop widths above 1226px and prevent shared button links from adopting Docusaurus's blue link-hover color.

## Confirmed causes

- The CTA title uses a fluid `.h2` font size but a fixed `max-width: 620px`. At 1226px the Chinese title still fits; at 1227px the slightly larger font crosses that fixed limit and wraps onto two lines.
- Docusaurus defines `a:hover { color: var(--ifm-link-hover-color) }`, whose current value is `#3578e5`. The button hover rules do not set a text color, so anchor buttons inherit the blue hover treatment.

## Design

- Add a Chinese-language override with `.cta .h2:lang(zh)` and raise only its maximum width to `680px`. The page language is `zh-Hans-CN`, which matches the `:lang(zh)` language range. Other locales retain the existing `620px` measure.
- Make `.btn:hover` explicitly retain the outlined button's ink color and remove link underlining.
- Make `.btn-solid:hover` explicitly retain the paper-colored text while keeping its existing black hover background.
- Do not change CTA markup, copy, global heading sizes, button dimensions, motion, or mobile wrapping behavior.

## Verification

- Add a focused source-level regression test for the locale-specific CTA width and both button hover color rules, following the repository's existing content/style-check pattern.
- Observe the new test fail before editing production CSS, then pass after the minimal CSS change.
- In the running Chinese site, verify the CTA title is one line at 1200, 1226, 1227, 1280, and 1440px.
- Verify computed hover colors for outlined and solid buttons remain within the site's ink-and-paper palette.
- Run the full test suite, typecheck, lint, and production build.

## Scope

This change is limited to `src/index.css` and one focused regression test. No unrelated refactoring or deployment is included.
