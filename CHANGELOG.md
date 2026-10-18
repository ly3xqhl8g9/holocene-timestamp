# Changelog

## 1.1.0

- Convert complete year ranges consistently, including abbreviated endpoints and years repeated elsewhere on a page.
- Recognize English and Norwegian decades, publication dates, and dates split across inline elements.
- Correct BC/BCE arithmetic and remove obsolete era markers when replacing dates. Preserve BHE for dates before the Holocene calendar.
- Preserve month/day values, page links, hidden date metadata, editable text, code, and recognizable non-date quantities.
- Handle ISO month dates, slash dates, and grouped BCE years without losing date components or converting existing HE dates again. Restore original text when a converted region becomes editable or hidden.
- Recognize era prefixes only at word boundaries, so years after words such as “since,” “France,” and “had” are converted consistently.
- Update the extension description, popup, and options examples to 2027 / 12027.
- Convert dynamically loaded content in batches without repeatedly converting the same dates.
- Preserve saved preferences when settings are missing; fix popup selection, dependent options, saving, reset, and formatting previews.
- Replace the jQuery conversion engine with a shared TypeScript parser and DOM renderer. Keep the existing interface and permissions.
- Add automated conversion, DOM, settings, formatting, build, and browser tests, plus reproducible ZIP packaging.
- Keep pnpm's 24-hour dependency release-age protection enabled, pin mature build dependencies, and migrate build permissions to pnpm 11 settings.
- Wait for every batched conversion in the production-bundle smoke check to prevent timing-dependent CI failures.
- Declare UTF-8 for browser-test HTML fixtures so Unicode date ranges reach the extension intact; keep stress-test sentence punctuation outside the era abbreviation.
