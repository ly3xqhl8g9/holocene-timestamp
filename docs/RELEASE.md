# Release 1.1.0

The active extension is `packages/extension-chrome-legacy`. The older React extension is a prototype and is outside the workspace.

## Verify and build

Use Node 24 LTS (24.15 or newer) and pnpm 11.3.0. From the `app` repository:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm package
```

`pnpm check` runs the unit/DOM suite, type checking, linting, both production builds, production-bundle DOM smoke checks, and the actual unpacked extension in Playwright's bundled Chromium. Browser tests use deterministic page fixtures and temporary profiles; they require no publisher credentials or local web server. On Linux, use `pnpm exec playwright install --with-deps chromium`.

The workspace explicitly retains pnpm's [24-hour minimum release age](https://pnpm.io/settings/dependency-resolution#minimumreleaseage). The build dependencies `schema-utils@4.5.0` and `watchpack@2.6.1` are pinned to mature versions compatible with Webpack. Dependency updates should preserve this policy and regenerate the lockfile with pnpm 11.3.0 using registry metadata that includes publication timestamps. Native dependency build permissions use pnpm 11's `allowBuilds` setting.

The extension declares Chrome 95 as its minimum version because its [promise-based storage API](https://developer.chrome.com/docs/extensions/reference/api/storage/StorageArea) requires it. No additional permissions are requested.

The extension's package version controls the generated manifest version. `pnpm package` builds from source, checks all manifest references, script loading, permissions, and ZIP contents, and creates a reproducible archive and SHA-256 file under `release/`. Do not upload an older cached `distribution` directory.

## Review the unpacked extension

1. Open `chrome://extensions`, enable Developer mode, and load `packages/extension-chrome-legacy/distribution` as an unpacked extension.
2. Confirm the current popup and options appearance, defaults, save/reset behavior, and stored choices after reopening.
3. Set “on every site,” replacement enabled, no wrappers, and HE removed. Reload the test pages.
4. Check English/Norwegian Michael Jackson, Socrates, and representative BBC/forskning.no articles. Expect `11958–12009`, `11960s`/`11960-årene`, `9531–9602`, and `17.10.12026` where the corresponding original dates appear.
5. Check default insertion mode, links, italic formatting, dynamically inserted text, and “off.”

Chrome's “Load unpacked” requires a folder containing `manifest.json`; the ZIP is for the store upload. To test the ZIP, extract it and load that folder. Rebuilding the ZIP does not update an earlier extracted copy: extract the new archive into the loaded folder and click **Reload** in `chrome://extensions`. Loading `distribution` directly avoids that extra extraction step.

Preferences apply to a page when it loads; reload existing tabs after changing them. The existing seven storage keys and their values remain compatible. Settings are merged per key; a missing value does not reset other choices. No additional permissions or data collection are introduced.

## Upload the existing listing

Upload `release/holocene-epoch-timestamp-1.1.0.zip` to the existing **Holocene Epoch Timestamp** item, ID `fbdlbdcmaglfifdihlihdpnnnidnippp`, in the Chrome Web Store Developer Dashboard. Use **Package → Upload new package**, review the displayed version and unchanged permission declarations, add the 1.1.0 notes from `CHANGELOG.md`, and submit for review. Google review/publication is a separate step from generating this ZIP.

Keep the ZIP and checksum that were submitted. If a release needs correction, use the dashboard's rollback facility where available, or build a corrected version with a higher version number. Do not clear users' synchronized preferences.

See `VERIFICATION.md` for the checks actually executed for this handoff and any environment limitations.
