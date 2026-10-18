import {
  convertedText, delimiters, HE_LINK_WIKIPEDIA, parserOptions, visibleEra,
  type DateSpan, type HoloceneTimestampParserOptions,
} from 'holocene-timestamp-parser';

/** Build extension output from text nodes. Page strings are never interpreted as HTML. */
export function createTimestamp(document: Document, date: Pick<DateSpan, 'holocene' | 'era'>, partial: Partial<HoloceneTimestampParserOptions>, allowLink = true): HTMLElement {
  const options = parserOptions(partial);
  const element = document.createElement(options.styleHETimestamp === 'ITALIC' ? 'i' : 'span');
  const [open, close] = delimiters(options);
  const era = visibleEra(date.era, options);
  const text = convertedText(date, options) + (era ? ` ${era}` : '');
  element.append(open);
  for (const part of text.split(/\b(BHE|HE)\b/)) {
    if (/^(BHE|HE)$/.test(part) && options.linkHE && allowLink) {
      const link = document.createElement('a');
      link.href = HE_LINK_WIKIPEDIA;
      link.textContent = part;
      element.append(link);
    } else element.append(part);
  }
  element.append(close);
  return element;
}
