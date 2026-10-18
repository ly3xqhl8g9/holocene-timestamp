import type { GregorianYear, HoloceneTimestampParserOptions, HoloceneYear } from './interfaces';
import { defaultParserOptions } from './data/defaults';
import { gregorianToHolocene } from './utilities';
import { HE_LINK_WIKIPEDIA } from './constants';

export interface TextEdit { start: number; end: number; text: string }
export interface DateSpan {
  start: number;
  end: number;
  source: string;
  kind: 'year' | 'range' | 'decade' | 'century';
  years: GregorianYear[];
  edits: TextEdit[];
  /** Converted expression without its common era suffix. Mixed eras are explicit. */
  holocene: string;
  era: HoloceneYear['type'] | null;
}
export interface DateContext { dateContext?: boolean }

const ERA = String.raw`(?:B\.?C\.?(?:E\.?)?|A\.?D\.?|C\.?E\.?)(?![\p{L}\p{N}_])`;
// Prefix eras need their own boundary, so "since 2022" cannot consume "ce 2022".
const PREFIX_ERA = String.raw`(?<![\p{L}\p{N}_])${ERA}`;
const YEAR = String.raw`(?:\d{1,3}(?:[,\u00a0\u2009\u202f]\d{3}){1,2}|\d{1,6})`;
const yearDigits = (value: string) => value.replace(/[,\u00a0\u2009\u202f]/g, '');
const yearValue = (value: string) => Number(yearDigits(value));
const normalizeEra = (era?: string): GregorianYear['type'] => era?.replaceAll('.', '').toUpperCase().startsWith('BC') ? 'BC' : 'AD';
const word = /[\p{L}\p{N}_]/u;
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th')}`;
const months = String.raw`(?:january|february|march|april|may|june|july|august|september|october|november|december|jan\.?|feb\.?|mar\.?|apr\.?|jun\.?|jul\.?|aug\.?|sep\.?|sept\.?|oct\.?|nov\.?|dec\.?|januar|februar|mars|mai|juni|juli|oktober|desember)`;
const dateWords = new RegExp(String.raw`(?:\b${months}\b[\s\d,.]*|\b(?:born|died|year|dated|født|død|året|år)\s+(?:(?:in|on|i|den)\s+)?)$`, 'iu');
const monthContext = new RegExp(String.raw`\b${months}\b[\s\d,.]*$`, 'iu');
const units = /^(?:\s*(?:%|‰|km\b|cm\b|mm\b|m\b|kg\b|g\b|lbs?\b|miles?\b|mph\b|[kmgt]?hz\b|[kmgt]?bytes?\b|[kmgt]b\b|[km]?w\b|pixels?\b|px\b|usd\b|eur\b|gbp\b|nok\b|kr\b|dollars?\b|euros?\b|people\b|inhabitants?\b|votes?\b|units?\b|items?\b|years?\b|months?\b|days?\b|hours?\b|minutes?\b|seconds?\b))/iu;
const quantityPrefix = /(?:[$€£¥₹₽]\s*|\b(?:USD|EUR|GBP|NOK|ISBN(?:-1[03])?|ISSN|ID|SKU|model|version|phone|tel|page|pages|pp\.?|p\.)[\s:#-]*)$/iu;

function boundaries(text: string, start: number, end: number): boolean {
  return !word.test(text[start - 1] ?? '') && !word.test(text[end] ?? '');
}

function nonDate(text: string, start: number, end: number): boolean {
  const before = text.slice(Math.max(0, start - 60), start);
  const after = text.slice(end, end + 40);
  return quantityPrefix.test(before) || units.test(after)
    || /\d[.,:]$/.test(before) || /^[.,:]\d/.test(after)
    || /(?:https?:\/\/|www\.)\S*$/i.test(before);
}

function eligible(text: string, start: number, end: number, year: number, explicit: boolean, context: DateContext): boolean {
  const semanticYear = context.dateContext === true && year >= 1000 && !/\d/.test(text[start - 1] ?? '') && !word.test(text[end] ?? '');
  const before = text.slice(Math.max(0, start - 70), start);
  const historicalYear = dateWords.test(before) && (year > 31 || !monthContext.test(before));
  return year > 0 && Number.isSafeInteger(year) && (boundaries(text, start, end) || semanticYear)
    && !/\d[,.]$/.test(before) && !/^[,.]\d/.test(text.slice(end))
    && (explicit || !/\d[,\u00a0\u2009\u202f]\d{3}/.test(text.slice(start, end)))
    && (explicit || !nonDate(text, start, end))
    && (explicit || (year >= 1000 && year <= 2200) || (context.dateContext === true && year >= 1000) || historicalYear);
}

function bounds(match: RegExpMatchArray, group: string): [number, number] {
  const value = match.indices?.groups?.[group];
  if (!value) throw new Error(`Missing date component: ${group}`);
  return value;
}

function eraEdit(match: RegExpMatchArray, group: string, previousEnd: number, prefix = false): TextEdit[] {
  if (!match.groups?.[group]) return [];
  const [start, end] = bounds(match, group);
  return [{ start: prefix ? start : previousEnd, end: prefix ? previousEnd : end, text: '' }];
}

/** Apply edits against the original string, never against previously converted output. */
export function applyTextEdits(text: string, edits: readonly TextEdit[], offset = 0): string {
  let result = text;
  for (const edit of [...edits].sort((a, b) => b.start - a.start || b.end - a.end)) {
    result = result.slice(0, edit.start - offset) + edit.text + result.slice(edit.end - offset);
  }
  return result;
}

function span(text: string, start: number, end: number, kind: DateSpan['kind'], years: GregorianYear[], edits: TextEdit[], era: DateSpan['era']): DateSpan {
  const source = text.slice(start, end);
  return { start, end, kind, years, source, edits, era, holocene: applyTextEdits(source, edits, start) };
}

/** Pure recognition API. Offsets refer to the supplied, unmodified text. */
export function parseDateSpans(text: string, context: DateContext = {}): DateSpan[] {
  const spans: DateSpan[] = [];
  const reserved: Array<{ start: number; end: number }> = [];
  const free = (start: number, end: number) => !reserved.some(r => start < r.end && end > r.start);
  const accept = (s: DateSpan) => { spans.push(s); reserved.push(s); };

  // Already converted dates and identifiers must never become date candidates.
  for (const re of [
    /\b\d{4,9}([/-])\d{1,2}(?:\1\d{1,2})?(?:(?:T| )\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?\s*(?:HE|BHE)\b/giu,
    new RegExp(String.raw`\b${YEAR}(?:s|['’]s|[-–](?:årene|åra|tallet)|(?:st|nd|rd|th)[ -]century|\s*[-–—/]\s*${YEAR})?\s*(?:HE|BHE)\b`, 'giu'),
    /(?:https?:\/\/|www\.)\S+/giu,
    /\b(?:ISBN(?:-1[03])?|ISSN)[:\s]*[\dX][\dX\s-]{6,}[\dX]\b/giu,
    /\b\d{3}[-.]\d{3}[-.]\d{4}\b/gu,
    /\bv\d+(?:\.\d+){1,}\b/giu,
  ]) for (const m of text.matchAll(re)) reserved.push({ start: m.index, end: m.index + m[0].length });

  // Reserve complete numeric dates before range recognition. Only their year changes.
  for (const pattern of [
    String.raw`(?<year>\d{4})(?<sep>[-/])(?<month>\d{1,2})\k<sep>(?<day>\d{1,2})(?:(?:T| )\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?`,
    String.raw`(?<day>\d{1,2})(?<sep>[./-])(?<month>\d{1,2})\k<sep>(?<year>\d{3,4})`,
    // An ASCII YYYY-MM token is a month, while an en-dash remains a year range.
    String.raw`(?<year>\d{4})-(?<month>\d{2})(?![-/\d])`,
    String.raw`(?<month>\d{1,2})/(?<year>\d{4})(?![/\d])`,
  ]) for (const m of text.matchAll(new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<date>${pattern})(?:\s*(?<era>${ERA}))?`, 'gidu'))) {
    const start = m.index, end = start + m[0].length, g = m.groups!;
    if (!free(start, end) || !boundaries(text, start, end)) continue;
    reserved.push({ start, end });
    let month = Number(g.month), day = g.day ? Number(g.day) : 1;
    const year = Number(g.year), type = normalizeEra(g.era ?? g.prefix);
    // The year is identical in either order; only swap an unambiguous US slash date.
    if (g.sep === '/' && month > 12 && day <= 12) [month, day] = [day, month];
    const calendarYear = type === 'BC' ? 1 - year : year;
    const leap = calendarYear % 4 === 0 && (calendarYear % 100 !== 0 || calendarYear % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || year === 0 || quantityPrefix.test(text.slice(Math.max(0, start - 50), start))) continue;
    const [ys, ye] = bounds(m, 'year');
    const y: GregorianYear = { value: year, type };
    const he = gregorianToHolocene(y);
    const [ds, de] = bounds(m, 'date');
    spans.push(span(text, g.prefix ? start : ys, g.era || g.prefix ? end : ye, 'year', [y], [
      { start: ys, end: ye, text: String(he.value) }, ...eraEdit(m, 'prefix', ds, true), ...eraEdit(m, 'era', de),
    ], he.type));
  }

  // Do not reinterpret an invalid numeric date or multi-part identifier as a range.
  for (const m of text.matchAll(/\b\d+(?:[./-]\d+){2,}\b/gu)) reserved.push({ start: m.index, end: m.index + m[0].length });

  // A day adjacent to a month name is not itself a short historical year.
  for (const pattern of [
    String.raw`${months}\s+(?<day>\d{1,2})(?:st|nd|rd|th)?[,]?\s+(?<year>${YEAR})`,
    String.raw`(?<day>\d{1,2})[.]?\s+${months}[.]?\s+(?<year>${YEAR})`,
  ]) for (const m of text.matchAll(new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<date>${pattern})(?:\s*(?<era>${ERA}))?`, 'gidu'))) {
    const start = m.index, end = start + m[0].length, g = m.groups!;
    if (!free(start, end) || !boundaries(text, start, end)) continue;
    reserved.push({ start, end });
    if (Number(g.day) < 1 || Number(g.day) > 31 || yearValue(g.year) < 1) continue;
    const [ys, ye] = bounds(m, 'year');
    const y: GregorianYear = { value: yearValue(g.year), type: normalizeEra(g.era ?? g.prefix) }, he = gregorianToHolocene(y);
    const [ds] = bounds(m, 'date');
    spans.push(span(text, g.prefix ? start : ys, end, 'year', [y], [
      { start: ys, end: ye, text: String(he.value) }, ...eraEdit(m, 'prefix', ds, true), ...eraEdit(m, 'era', ye),
    ], he.type));
  }

  const century = new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<year>\d{1,4})(?<ordinal>st|nd|rd|th)(?<label>[ -]century)(?:\s*(?<era>${ERA}))?`, 'gidu');
  for (const m of text.matchAll(century)) {
    const start = m.index, end = start + m[0].length, g = m.groups!, n = Number(g.year);
    if (!free(start, end) || !boundaries(text, start, end) || n < 1 || `${g.year}${g.ordinal}`.toLowerCase() !== ordinal(n)) continue;
    const bc = normalizeEra(g.era ?? g.prefix) === 'BC';
    const value = bc ? (n <= 100 ? 101 - n : n - 100) : n + 100;
    const [ys] = bounds(m, 'year'), [, oe] = bounds(m, 'ordinal'), [, le] = bounds(m, 'label');
    const edits = [{ start: ys, end: oe, text: ordinal(value) }, ...eraEdit(m, 'prefix', ys, true), ...eraEdit(m, 'era', le)];
    accept(span(text, start, end, 'century', [{ value: n, type: bc ? 'BC' : 'AD' }], edits, bc && n > 100 ? 'BHE' : 'HE'));
  }

  const decade = new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<year>${YEAR})(?<suffix>s|['’]s|[-–](?:årene|åra|tallet))(?:\s*(?<era>${ERA}))?`, 'gidu');
  for (const m of text.matchAll(decade)) {
    const start = m.index, end = start + m[0].length, g = m.groups!, n = yearValue(g.year);
    if (!free(start, end) || n % 10 !== 0 || !eligible(text, start, end, n, !!(g.prefix || g.era), context)) continue;
    const [ys] = bounds(m, 'year'), [, se] = bounds(m, 'suffix');
    const y: GregorianYear = { value: n, type: normalizeEra(g.era ?? g.prefix) };
    const first = gregorianToHolocene({ ...y, value: y.type === 'BC' ? n + 9 : n });
    const last = gregorianToHolocene(y);
    const same = first.type === last.type;
    const value = y.type === 'BC'
      ? `${first.value}${same ? '' : ` ${first.type}`}–${last.value}${same ? '' : ` ${last.type}`}`
      : `${first.value}${g.suffix}`;
    accept(span(text, start, end, 'decade', [y], [{ start: ys, end: se, text: value }, ...eraEdit(m, 'prefix', ys, true), ...eraEdit(m, 'era', se)], same ? last.type : null));
  }

  const ranges = new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<first>${YEAR})(?:\s*(?<firstEra>${ERA}))?(?<separator>\s*[-–—−/]\s*)(?<second>${YEAR})(?:\s*(?<secondEra>${ERA}))?`, 'gidu');
  for (const m of text.matchAll(ranges)) {
    const start = m.index, end = start + m[0].length, g = m.groups!;
    if (!free(start, end)) continue;
    const explicit = !!(g.prefix || g.firstEra || g.secondEra);
    const first: GregorianYear = { value: yearValue(g.first), type: normalizeEra(g.firstEra ?? g.prefix ?? g.secondEra) };
    const second: GregorianYear = { value: yearValue(g.second), type: normalizeEra(g.secondEra ?? g.firstEra ?? g.prefix) };
    const firstLength = yearDigits(g.first).length, secondLength = yearDigits(g.second).length;
    if (secondLength < firstLength && first.type === second.type) {
      const modulus = 10 ** secondLength;
      second.value += Math.floor(first.value / modulus) * modulus;
      if (first.type === 'AD' && second.value < first.value) second.value += modulus;
      if (first.type === 'BC' && second.value > first.value) second.value -= modulus;
    }
    if (!eligible(text, start, end, first.value, explicit, context) || second.value < 1
      || (!explicit && secondLength === firstLength && !eligible(text, start, end, second.value, false, context))) {
      // An unrecognized numeric range must not partially convert as individual years.
      reserved.push({ start, end });
      continue;
    }
    const a = gregorianToHolocene(first), b = gregorianToHolocene(second), same = a.type === b.type;
    const [as, ae] = bounds(m, 'first'), [bs, be] = bounds(m, 'second');
    const edits = [
      { start: as, end: ae, text: `${a.value}${same ? '' : ` ${a.type}`}` },
      { start: bs, end: be, text: `${b.value}${same ? '' : ` ${b.type}`}` },
      ...eraEdit(m, 'prefix', as, true), ...eraEdit(m, 'firstEra', ae), ...eraEdit(m, 'secondEra', be),
    ];
    accept(span(text, start, end, 'range', [first, second], edits, same ? a.type : null));
  }

  const years = new RegExp(String.raw`(?:(?<prefix>${PREFIX_ERA})\s*)?(?<year>${YEAR})(?:\s*(?<era>${ERA}))?`, 'gidu');
  for (const m of text.matchAll(years)) {
    const start = m.index, end = start + m[0].length, g = m.groups!, n = yearValue(g.year);
    if (!free(start, end) || !eligible(text, start, end, n, !!(g.prefix || g.era), context)) continue;
    const [ys, ye] = bounds(m, 'year');
    const y: GregorianYear = { value: n, type: normalizeEra(g.era ?? g.prefix) }, he = gregorianToHolocene(y);
    accept(span(text, start, end, 'year', [y], [{ start: ys, end: ye, text: String(he.value) }, ...eraEdit(m, 'prefix', ys, true), ...eraEdit(m, 'era', ye)], he.type));
  }
  return spans.sort((a, b) => a.start - b.start);
}

export const parserOptions = (options: Partial<HoloceneTimestampParserOptions> = {}): HoloceneTimestampParserOptions => ({ ...defaultParserOptions, ...Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)) });
export const delimiters = (options: HoloceneTimestampParserOptions): [string, string] => ({ BRACKETS: ['[', ']'], ACCOLADES: ['{', '}'], SLASHES: ['/', '/'], NOTHING: ['', ''] })[options.insertBetween] as [string, string];
export const visibleEra = (era: DateSpan['era'], options: HoloceneTimestampParserOptions) => era === 'BHE' ? 'BHE' : era && !options.removeHE ? 'HE' : '';
export const convertedText = (date: Pick<DateSpan, 'holocene'>, options: HoloceneTimestampParserOptions) => options.removeHE ? date.holocene.replace(/ HE\b/g, '') : date.holocene;
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

/** Legacy HTML formatting API; the extension uses safe DOM nodes instead. */
export function formatDateSpan(date: DateSpan, partial: Partial<HoloceneTimestampParserOptions> = {}): string {
  const options = parserOptions(partial), [open, close] = delimiters(options);
  const era = visibleEra(date.era, options);
  let content = convertedText(date, options) + (era ? ` ${era}` : '');
  content = escapeHtml(content);
  if (options.linkHE) content = content.replace(/\b(BHE|HE)\b/g, `<a href="${HE_LINK_WIKIPEDIA}">$1</a>`);
  content = open + content + close;
  return options.styleHETimestamp === 'ITALIC' ? `<i>${content}</i>` : content;
}
