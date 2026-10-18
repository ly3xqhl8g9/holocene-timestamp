# Active extension architecture

The shipping Manifest V3 extension is `packages/extension-chrome-legacy`. The directory name is historical. `packages/holocene-timestamp-parser` is its shared TypeScript library. The React extension prototype and promotional website are outside the active workspace and release build.

## Recognition and rendering

`parser.ts` recognizes dates in unmodified text and returns nonoverlapping UTF-16 spans and edits. Recognition protects existing HE/BHE expressions and identifiers, then handles numeric/named dates, centuries, decades, ranges, and individual years. This ordering prevents a year replacement from corrupting a later range match. Calendar utilities account for the absence of year zero.

Balanced detection permits bare years 1000–2200. Other years need date or era context. Known units, currencies, identifiers, URLs, and invalid numeric dates are excluded. Grouped years require an explicit era or a full named date. ASCII `YYYY-MM` denotes a month; en-dashes can express abbreviated year ranges. These are deterministic heuristics, so some unlabelled numbers remain ambiguous.

`page.ts` combines adjacent inline text into logical runs while preserving elements, links, listeners, citations, and attributes. Block boundaries separate date context. Hidden metadata, editing regions, controls, scripts, code, and other excluded elements are skipped. Generated content uses DOM text nodes; page strings are never inserted as HTML.

Original text nodes remain available to page frameworks. Weak maps associate them with generated output, and segment mappings retain original era context when a framework edits neighboring text. A mutation observer queues affected blocks, with work yielding between batches. Generated mutations are ignored, and original text is restored when regions become hidden or editable. `contentscript.ts` stops observation on page exit and resumes after back/forward-cache restoration.

## Preferences and interface

`settings.ts` owns the original seven synchronized storage keys, allowed values, defaults, and parser mappings. Loading normalizes each key independently without writing preferences; installation repairs only missing or invalid keys. Wikipedia activation checks the hostname. Preferences take effect when a page loads.

`popup.ts` and `options.ts` use the existing HTML/CSS and controls. `render.ts` formats safe DOM output for both previews and page dates. BHE always remains visible, including when HE is hidden. Links are placed beside existing anchors to avoid nesting them.

## Build and verification

Webpack builds the four extension entry points and copies the original assets. Its generated manifest takes the package version. The parser also builds UMD, ES-module, and declaration outputs. Node 24 and pnpm 11 are the supported development tools.

Vitest covers recognition, DOM updates, preferences, interface behavior, and the formatting combinations. `test:bundle` evaluates the actual production content script and UMD library in a DOM simulation. Playwright separately loads the production extension in a temporary Chromium profile with deterministic HTTPS fixtures. The CI workflow runs all checks before packaging.

`scripts/package.mjs` validates manifest references, permissions, interface scripts, and archive contents, then writes a reproducible ZIP and checksum. Packaging alone does not execute the test suite. See [release steps](RELEASE.md) and [verification evidence and outstanding checks](VERIFICATION.md).
