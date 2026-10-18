# Holocene Timestamp Parser

The shared TypeScript date engine for Holocene Epoch Timestamp. Version 0.1.0 is bundled locally with extension 1.1.0; no separate npm publication is required.

## Existing string API

```ts
import HoloceneTimestampParser from 'holocene-timestamp-parser';

const result = new HoloceneTimestampParser('470–399 BC').text({
  replaceTimestamp: true,
  insertBetween: 'NOTHING',
  removeHE: true,
});
// result.HE === '9531–9602'
// result.matchedYears contains 470 and 399
```

The constructor, `.text()` options, `HE` string, `matchedYears` set, calendar utilities, and exported enumerations remain available. Partial options merge with defaults: insert after the original, brackets, regular style, linked HE, original retained. The string formatter can emit formatting HTML; applications should use the structured API and DOM text nodes for page content.

## Structured API

```ts
import { parseDateSpans } from 'holocene-timestamp-parser';

const dates = parseDateSpans('born 470–399 BC; later 2026');
// Nonoverlapping DateSpan objects with original start/end offsets, source,
// kind, Gregorian years, text edits, converted text, and Holocene era.
```

All offsets address the original UTF-16 string. Apply edits from the end toward the beginning. Recognition occurs before replacement, so repeated year values and ranges cannot corrupt one another.

Supported expressions include full dates, full and abbreviated year ranges, English/Norwegian decades, English centuries, and AD/CE/BC/BCE labels. Numeric and named dates protect month/day values. Numeric dates support year-first, day-first, and unambiguous US slash formats. `YYYY-MM` is treated as an ISO month, `MM/YYYY` as a month/year date, and an en-dash retains year-range meaning. Explicit era labels support grouped years such as `12,345 BC` and `12 345 BCE`; unlabelled grouped quantities remain unchanged. A BC/BCE decade becomes its exact Holocene interval rather than an incorrectly aligned decade label. Existing HE/BHE dates, decades, and centuries are protected against conversion.

Balanced detection permits bare years 1000–2200. Other years need era/date context. Recognizable quantities, prices, identifiers, code-like tokens, URLs, and existing HE/BHE dates are excluded. Ambiguous ordinary numbers cannot always be distinguished from years without context; the parser uses deterministic rules, not a language model.

`1 AD = 10001 HE`, `1 BC = 10000 HE`, `10000 BC = 1 HE`, and `10001 BC = 1 BHE`. BHE is retained when HE is hidden, preserving the distinction for prehistoric dates.

Production builds provide UMD, ES-module, and TypeScript declaration outputs. Both JavaScript outputs target ES2022; the module file retains its historical `.es5.js` filename.

From the workspace root, run `pnpm test`, `pnpm typecheck`, or `pnpm build`.
