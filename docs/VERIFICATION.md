# 1.1.0 verification

**Automated verification passed.** [GitHub Actions run #3](https://github.com/ly3xqhl8g9/holocene-timestamp/actions/runs/39119401360), at commit `8535dd7c21d2048f07a1eab4bc1134032b43a5d5`, completed successfully on 18 October 2026. The workflow and job results were independently confirmed through GitHub's API: frozen installation, Chromium installation, `pnpm check`, packaging, and artifact uploads all passed. This completes the automated browser verification that was previously pending. Local checks and live-site testing of the installed extension in insertion and replacement modes also passed. The owner's final popup/options appearance review and Store submission remain manual steps in `RELEASE.md`.

## Executed checks

Local environment: macOS ARM64, Node **24.22.0**, pnpm **11.3.0**, TypeScript **6.0.3**. CI environment: Ubuntu, Node **24**, pnpm **11.3.0**, and Playwright's bundled Chromium.

| Check | Result |
| --- | --- |
| `pnpm test` | **573 passed**, 10 files; no skipped or focused tests |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm build` | Passed: extension, parser UMD/ES module, and type declarations |
| `pnpm test:bundle` | Passed: production content script and public UMD library in a DOM simulation |
| `pnpm package` | Passed: all manifest assets, single script loading per interface page, permissions, and ZIP round trip validated |
| ZIP reproducibility | Identical output for UTC and Europe/Bucharest packaging timestamps |
| Independent ZIP inspection | Passed: CRC, 15 assets, manifest, permissions, checksum, and byte-for-byte match with the production build |
| Fresh frozen dependency installation | Passed in a separate workspace with `pnpm install --offline --frozen-lockfile`: all 318 supply-chain checks passed using authentic npm publication metadata and cached public package archives |
| `pnpm test:e2e --list` | Five browser scenarios discovered; discovery is not an execution pass |
| Local `pnpm test:e2e --max-failures=1` | Blocked before extension loading: required Chromium executable missing; browser execution subsequently verified in CI |
| Earlier owner-provided GitHub Actions log, `setup: package #2` | Four browser scenarios passed; the large-article fixture failed with corrupted Unicode punctuation, corrected before run #3 |
| Corrected large-article fixture, production-bundle DOM simulation | Passed: UTF-8 wire bytes decoded correctly, all 2,000 paragraphs converted exactly, and the page timer ran between conversion batches; this is not a browser E2E pass |
| GitHub Actions run #3, `pnpm check` | Passed: unit/DOM tests, type checking, lint, production builds, bundle smoke checks, and the full five-scenario Playwright suite |
| GitHub Actions run #3, packaging and uploads | Passed: `pnpm package`, `holocene-epoch-timestamp` artifact, and `verification-evidence` artifact |
| `git diff --check` | Passed |
| Existing CSS, icons, and bundled proposal PDF | Unchanged from the repository's initial revision |
| Documentation references | All 11 relative links resolve across the 9 active/archival documents reviewed |
| Installed extension in Chrome | Passed: live English/Norwegian Wikipedia, Socrates, BBC, and forskning.no checks described below |

The tests cover the reported years/ranges/decades and BC cleanup, calendar boundaries, month/day preservation, abbreviated and mixed-era ranges, Wikipedia citations within a date range, all 128 formatting combinations across three expression types, dynamic DOM updates, existing links, excluded content, malicious-looking text remaining text, saved preferences, storage failures, and popup/options behavior.

Before replacing the shared parser implementation, 9 of its 14 initial regression checks failed. Separate reproduction of the shipping engine confirmed the overlapping range-replacement bug, lost final tokens, unsupported Norwegian decades, and BC context lost across inline elements.

## Follow-up audit — 18 October 2026

The second implementation review added 37 regression checks and fixed additional cases reproduced before the fixes:

- ISO dates with a trailing BC/BCE label retain their month, day, and time. Prefix eras on numeric and named dates are removed and used in the arithmetic.
- Grouped historical years and ranges, such as `12,345 BC`, convert as complete numbers. Unlabelled grouped quantities remain unchanged.
- ISO month dates and month/year slash dates take precedence over year ranges. Valid US slash dates convert; invalid numeric dates and multi-part identifiers are protected.
- Existing HE/BHE numeric dates, Norwegian decades, and centuries remain unchanged.
- Original text is restored when a region becomes editable or hidden, then converted again if the region becomes eligible.
- Explicitly undefined optional parser properties retain their defaults.

The production-bundle smoke check now exercises these date formats and editing transitions. The complete Playwright suite subsequently passed in CI run #3 after the fixture correction below. README links were repaired, the [current architecture](ARCHITECTURE.md) was documented, and old implementation notes were marked archival.

## Installed-extension live checks — 18 October 2026

After the owner installed the unpacked 1.1.0 extension, public pages were tested in their Chrome browser. English/Norwegian Wikipedia and Socrates first passed with insertion after the original, brackets, and HE shown. The owner then saved the reporter's replacement settings: on every site, replace original dates, remove HE, and no delimiters. The extension was reloaded after the final fix and these checks passed again:

| Live page | Confirmed replacement behavior |
| --- | --- |
| [English Michael Jackson](https://en.wikipedia.org/wiki/Michael_Jackson) | Birth/death years become `11958` and `12009`; English decades convert. Hidden ISO birth metadata stays `1958-08-29`. |
| [Norwegian Michael Jackson](https://no.wikipedia.org/wiki/Michael_Jackson) | `11958–12009`, `11960-årene`, and `11980-årene`; the visible year link changes while its original `/wiki/1958` destination is retained. |
| [Socrates](https://en.wikipedia.org/wiki/Socrates) | Intro becomes `9531 – 9602`; infobox birth/death dates become `9531` and `9602`; obsolete BC labels are removed from those dates. |
| [BBC article](https://www.bbc.com/news/articles/c639mm1mrv94o) | Publication date becomes `26 September 12026`; `2022` in the headline and article becomes `12022`. The original `datetime` attribute is retained. |
| [BBC search results](https://www.bbc.com/search?q=2022) | Years after “since” become `12022`/`12002`, publication dates use `12026`, and the quantity `1,000 jobs` stays unchanged. |
| [forskning.no article](https://www.forskning.no/planeter-universet/hva-skjer-hvis-jorda-slutter-a-rotere/2722817) | Publication date becomes `18.10.12026 - 00:01`; the original ISO `datetime` attribute is retained. |

The checks also confirmed no nested anchors on the inspected Wikipedia/BBC pages. BBC's search controls remained interactive and a typed `2022` stayed unchanged in the search input. Screenshots of Norwegian Wikipedia in insertion mode, Socrates in replacement mode, and the BBC article in replacement mode were inspected for readable dates and intact page layout. These are live page checks, not a claim that the separate Playwright suite passed.

Live BBC search testing caught another parser bug: the letters “ce” inside “since” could be consumed as a CE prefix, preventing the following date from matching. The same failure was reproduced directly with seven expressions before fixing prefix word boundaries. Ten regression checks were added, including genuine prefix/suffix era cases. The exact live BBC headings passed after rebuilding and reloading the extension.

The manifest description, popup preview, and options example now use `2027` / `12027`. The six interface tests, type checking, linting, and production build passed for this copy update. The unpacked test folder was refreshed and checked byte-for-byte against the latest ZIP.

## CI dependency-policy correction — 18 October 2026

The first GitHub Actions run rejected `schema-utils@4.6.0` and `watchpack@2.6.2` because they were less than 24 hours old. The earlier cached local install did not reproduce the fresh-CI policy check. The failure was subsequently reproduced in a separate workspace with the same pnpm version and authentic npm publication metadata.

The lockfile now selects `schema-utils@4.5.0` and `watchpack@2.6.1`, both within Webpack's declared dependency ranges. Replaying the original CI cutoff against all 318 lockfile entries reports the original two violations before the change and none afterward. A fresh frozen install then passed all 318 checks and installed successfully. The 24-hour policy remains enabled with no package exclusions or trusted-lockfile bypass. Obsolete pnpm settings were replaced with `pmOnFail` and `allowBuilds`.

That verification also exposed a timing bug in `test:bundle`: it waited for one early example and could assert later examples before their conversion batch ran. The smoke check now waits for each expected result. A controlled one-block-per-batch reproduction fails with the old check and passes with the corrected check.

All 573 tests, type checking, linting, and the production builds passed after the dependency correction. The rebuilt ZIP is byte-for-byte identical to the version tested in Chrome. The owner's subsequent Actions log confirms dependency installation, build, and bundle checks now pass; the browser suite reached the separate fixture failure described below.

## CI fixture-encoding correction — 18 October 2026

The owner's `setup: package #2` Actions log reports four browser scenarios passing: reported date shapes, fresh-install defaults and popup/options persistence, activation scope, and dynamic content with link interaction. The remaining large-article test received `1958â€“2009` instead of `1958–2009`. Its mocked HTTP response declared `text/html` without a character encoding or HTML charset declaration.

The failure was reproduced by decoding the actual UTF-8 fixture bytes with the same missing charset: the DOM chose Windows-1252 and the production parser produced the exact corrupted output from CI. Declaring UTF-8 restores both range endpoints. This also revealed an independent fixture expectation mismatch: the parser treats the period in `BC.` as part of the era abbreviation, as its existing dotted-era tests specify. The stress fixture now uses `(470–399 BC).`, retaining an unambiguous sentence period outside the era label while still checking full BC range conversion and label removal.

Every mocked HTML response now shares an explicit `text/html; charset=utf-8` content type. The large-article scenario also asserts `document.characterSet` is `UTF-8` before checking the converted result. A production-bundle DOM replay of the corrected wire-byte fixture converted all 2,000 paragraphs to the exact expected text and allowed the page timer to run between batches. All 573 tests, type checking, linting, production-bundle checks, and discovery of the five browser scenarios passed after the fixture change.

No production source or release ZIP changed. The complete Playwright suite subsequently passed as part of `pnpm check` in CI run #3. The local environment remains unable to launch Chromium; its launch restrictions are separate from the successful CI browser execution.

## Browser coverage and remaining manual review

A cached Chromium launch terminated before loading the extension (`SIGABRT`, with host permission errors during cleanup). The follow-up audit reran `pnpm test:e2e --max-failures=1`; it stopped before browser launch because the matching `chromium-1248` executable was missing from the default cache. Browser URL policy also blocked local fixtures and `chrome://extensions`. Public-page testing became possible after the owner installed the unpacked extension and performed the required reload/settings clicks; those results are recorded above.

The included Playwright suite uses a temporary profile, loads the real production extension, and supplies deterministic HTTPS page fixtures without a local server. It tests the reported date shapes, fresh installation, popup/options persistence, activation scope, dynamic content, link interaction, and responsiveness on a large article. All five scenarios are included in the successful `pnpm check` step in [CI run #3's verify job](https://github.com/ly3xqhl8g9/holocene-timestamp/actions/runs/39119401360/job/117651722837). The owner's final popup/options appearance comparison remains a manual release check; automated behavior checks have passed.

## Release artifact

`release/holocene-epoch-timestamp-1.1.0.zip` contains only the 15 extension assets, with `manifest.json` at the archive root. Its adjacent `.sha256` file records the exact digest. Source maps, dependencies, tests, old scripts, and jQuery are excluded.

The manifest remains V3, retains the existing name and permissions, and declares Chrome 95 or newer for the promise-based storage API. The original seven synchronized preference keys are retained. The extension UI has no design changes; its existing control behavior and markup defects were repaired. A visual browser comparison is still required.

Automated release checks are complete. The owner's final visual review and Chrome Web Store submission are the remaining manual steps. No Chrome Web Store upload/publication or separate npm publication was performed. Submission is the owner's chosen next step.
