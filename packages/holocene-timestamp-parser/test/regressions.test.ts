import HoloceneTimestampParser, { gregorianToHolocene } from '../src';

const plain = { insertBetween: 'NOTHING', linkHE: false, removeHE: true, replaceTimestamp: true } as const;
const convert = (text: string) => new HoloceneTimestampParser(text).text(plain).HE;

describe('reported date conversion regressions', () => {
  it.each([
    ['1958–2009. Born 1958 and died 2009.', '11958–12009. Born 11958 and died 12009.'],
    ['Published in 2026', 'Published in 12026'],
    ['2022', '12022'],
    ['the 1960s and 1980s', 'the 11960s and 11980s'],
    ['1960-årene og 1980-årene', '11960-årene og 11980-årene'],
    ['470–399 BC', '9531–9602'],
    ['c.\u2009470 – 399\u00a0BC', 'c.\u20099531 – 9602'],
    ['17.10.2026', '17.10.12026'],
    ['August 29, 1958 – June 25, 2009', 'August 29, 11958 – June 25, 12009'],
    ['29. august 1958', '29. august 11958'],
    ['10 Sep. 259 BC', '10 Sep. 9742'],
    ['1999–02', '11999–12002'],
    ['2026 CE', '12026'],
    ['distance 2026 km', 'distance 2026 km'],
    ['$2026', '$2026'],
    ['12026 HE and 2000 BHE', '12026 HE and 2000 BHE'],
  ])('%s → %s', (input, output) => expect(convert(input)).toBe(output));

  it('converts the first Holocene year without inventing year zero', () => {
    expect(gregorianToHolocene({ value: 10000, type: 'BC' })).toEqual({ value: 1, type: 'HE' });
  });
});
