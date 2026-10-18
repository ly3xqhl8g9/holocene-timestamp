import type { HoloceneTimestampParsed, HoloceneTimestampParserOptions } from '../../interfaces';
import { applyTextEdits, formatDateSpan, parseDateSpans, parserOptions } from '../../parser';

class HoloceneTimestampParser {
  constructor(private data: string) {}

  public text(partial: Partial<HoloceneTimestampParserOptions> = {}): HoloceneTimestampParsed {
    const options = parserOptions(partial);
    const spans = parseDateSpans(this.data);
    const edits = spans.map(date => {
      const formatted = formatDateSpan(date, options);
      const text = options.replaceTimestamp ? formatted : options.insertLocation === 'BEFORE'
        ? `${formatted} ${date.source}` : `${date.source} ${formatted}`;
      return { start: date.start, end: date.end, text };
    });
    return { HE: applyTextEdits(this.data, edits), matchedYears: new Set(spans.flatMap(date => date.years.map(year => year.value))) };
  }
}

export default HoloceneTimestampParser;
