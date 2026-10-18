import Parser from '../src';

const convert = (text: string) => new Parser(text).text({ replaceTimestamp: true, insertBetween: 'NOTHING', removeHE: true, linkHE: false }).HE;

it.each([
  ['2026-10-17 BC', '7975-10-17'],
  ['2026-10-17T12:30:00Z BCE', '7975-10-17T12:30:00Z'],
  ['AD 2026-10-17', '12026-10-17'],
  ['17/10/2026 BC', '17/10/7975'],
  ['10/17/2026', '10/17/12026'],
  ['02/29/2024', '02/29/12024'],
  ['2026-10', '12026-10'],
  ['2026-01', '12026-01'],
  ['10/2026', '10/12026'],
  ['12,345 BC', '2345 BHE'],
  ['10,000 BCE', '1'],
  ['12\u202f345 BCE', '2345 BHE'],
  ['12,000–11,000 BC', '2000–1000 BHE'],
  ['January 1, 12,345 BC', 'January 1, 2345 BHE'],
  ['2,026 people', '2,026 people'],
  ['12,345', '12,345'],
  ['1960-årene HE', '1960-årene HE'],
  ['19th century HE', '19th century HE'],
  ['2026-10-17 HE', '2026-10-17 HE'],
  ['2026-10 HE', '2026-10 HE'],
  ['12,345 BHE', '12,345 BHE'],
  ['1958\u00a0–\u00a02009', '11958\u00a0–\u00a012009'],
  ['2026\u00a02022', '12026\u00a012022'],
  ['12,34 BC', '12,34 BC'],
  ['17/99/2026', '17/99/2026'],
  ['02/29/2025', '02/29/2025'],
  ['AD January 1, 2026', 'January 1, 12026'],
  ['BC 1 January 2026', '1 January 7975'],
  ['399 B.C', '9602'],
  ['BC 17/10/2026', '17/10/7975'],
  ['2026-10 BC', '7975-10'],
  ['2026-10-170', '2026-10-170'],
  ['12.345.678', '12.345.678'],
  ['Netflix to shed 1,000 jobs in steepest cuts since 2022', 'Netflix to shed 1,000 jobs in steepest cuts since 12022'],
  ['US government borrowing costs hit the highest level since 2002', 'US government borrowing costs hit the highest level since 12002'],
  ['France 2026', 'France 12026'],
  ['had 2026', 'had 12026'],
  ['since 1960s', 'since 11960s'],
  ['since 19th century', 'since 119th century'],
  ['since 1958–2009', 'since 11958–12009'],
  ['since 17/10/2026', 'since 17/10/12026'],
  ['399BC', '9602'],
  ['AD 1066', '11066'],
])('keeps complete expressions consistent: %s', (input, expected) => expect(convert(input)).toBe(expected));

it('applies option defaults when optional properties are explicitly undefined', () => {
  expect(new Parser('2026').text({ insertBetween: undefined }).HE).toBe(new Parser('2026').text().HE);
});
