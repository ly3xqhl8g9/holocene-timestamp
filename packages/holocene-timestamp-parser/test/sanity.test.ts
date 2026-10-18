import HoloceneTimestampParser from '../src';

it('retains the public constructor and default formatted output', () => {
  const result = new HoloceneTimestampParser('the year 2019').text();
  expect(result.HE).toContain('2019 [12019 ');
  expect(result.matchedYears).toEqual(new Set([2019]));
});
