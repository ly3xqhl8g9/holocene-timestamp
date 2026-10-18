import Parser, { parseDateSpans, gregorianToHolocene, holoceneToGregorian } from '../src';

const convert = (text: string) => new Parser(text).text({ replaceTimestamp: true, insertBetween: 'NOTHING', removeHE: true, linkHE: false }).HE;
it.each([
  ['AD 1066', '11066'], ['1066 CE', '11066'], ['399 B.C.', '9602'], ['399 B.C.E.', '9602'],
  ['1 BC', '10000'], ['1 AD', '10001'], ['10000 BCE', '1'], ['10001 BC', '1 BHE'], ['12000 BC', '2000 BHE'],
  ['470–69 BC', '9531–9532'], ['431/430 BC', '9570/9571'], ['1999–2', '11999–12002'],
  ['12000–11000 BC', '2000–1000 BHE'], ['1 BC–1 AD', '10000–10001'], ['10001–10000 BC', '1 BHE–1'],
  ['450s BC', '9542–9551'], ['1990s CE', '11990s'], ['1960-tallet', '11960-tallet'],
  ['19th century', '119th century'], ['21st-century', '121st-century'], ['5th century BCE', '96th century'],
  ['100th century BC', '1st century'], ['101st century BC', '1st century BHE'],
  ['2026-10-17', '12026-10-17'], ['2026/10/17', '12026/10/17'], ['17/10/2026', '17/10/12026'],
  ['2026-10-17T12:30:00Z', '12026-10-17T12:30:00Z'],
  ['Born in 70', 'Born in 10070'], ['May 399 BC', 'May 9602'],
])('recognizes %s', (input, expected) => expect(convert(input)).toBe(expected));

it.each([
  '2026 km', '1958 kg', '2026%', '2026 people', 'USD 2026', '2026 NOK', 'ID: 2026', 'model 1958',
  '1500 years', 'Born 50 years ago', '2026 days',
  'October 17', 'June 25', 'Born on May 1', 'January 1',
  'page 2026', 'v2026.1.2', 'version 2026', '2026.50', 'ISBN 978-1-2026-1958-0',
  'https://example.com/2026', '2026abc', 'ár2026', '12026', '399', '2201', '0 BC',
  '31.02.2026', '2026-99-99', '29.02.2025', '1500–2400',
])('leaves a non-date or unsupported expression unchanged: %s', input => expect(convert(input)).toBe(input));

it('retains every era when the same numeric year occurs twice', () => {
  const result = new Parser('399 BC and AD 399').text({ replaceTimestamp: true, insertBetween: 'NOTHING', removeHE: true });
  expect(result.HE).toBe('9602 and 10399'); expect(result.matchedYears).toEqual(new Set([399]));
});
it('reports nonoverlapping source offsets including the original era', () => {
  const source = 'born 470–399 BC; later 2026';
  const spans = parseDateSpans(source);
  expect(spans.map(span => source.slice(span.start, span.end))).toEqual(['470–399 BC', '2026']);
  expect(spans[0].end).toBeLessThan(spans[1].start);
});
it('round trips the epoch boundaries and a wide range of historical years', () => {
  for (const type of ['AD', 'BC'] as const) for (const value of [1, 2, 399, 999, 1000, 9999, 10000, 10001, 12000, 99999]) {
    const original = { value, type };
    expect(holoceneToGregorian(gregorianToHolocene(original))).toEqual(original);
  }
});
