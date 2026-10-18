// @vitest-environment jsdom
import Parser, { parseDateSpans, type HoloceneTimestampParserOptions } from 'holocene-timestamp-parser';
import { createTimestamp } from '../src/render';
import { PageConverter } from '../src/page';

const matrix: HoloceneTimestampParserOptions[] = [];
beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }));
afterEach(() => vi.useRealTimers());
for (const insertLocation of ['BEFORE', 'AFTER'] as const)
  for (const insertBetween of ['BRACKETS', 'ACCOLADES', 'SLASHES', 'NOTHING'] as const)
    for (const styleHETimestamp of ['REGULAR', 'ITALIC'] as const)
      for (const linkHE of [true, false]) for (const removeHE of [true, false]) for (const replaceTimestamp of [true, false])
        matrix.push({ insertLocation, insertBetween, styleHETimestamp, linkHE, removeHE, replaceTimestamp });

it.each(matrix.flatMap(options => ['399 BC', '10001–10000 BC', '19th century'].map(source => ({ options, source }))))('shares page, preview, and public formatting for %j', async ({ options, source }) => {
  const date = parseDateSpans(source)[0];
  const preview = createTimestamp(document, date, options);
  const publicResult = document.createElement('div'); publicResult.innerHTML = new Parser(source).text(options).HE;
  const expected = options.replaceTimestamp ? preview.textContent : options.insertLocation === 'BEFORE'
    ? `${preview.textContent} ${source}` : `${source} ${preview.textContent}`;
  expect(publicResult.textContent).toBe(expected);
  const links = options.linkHE ? (preview.textContent!.match(/\b(?:BHE|HE)\b/g)?.length ?? 0) : 0;
  expect(preview.querySelectorAll('a').length).toBe(links);
  expect(preview.tagName).toBe(options.styleHETimestamp === 'ITALIC' ? 'I' : 'SPAN');

  document.body.innerHTML = `<p>${source}</p>`;
  const converter = new PageConverter(document.body, options); converter.start(); await vi.runAllTimersAsync(); converter.stop();
  expect(document.querySelector('p')!.textContent).toBe(expected);
  expect(document.querySelector('p a a')).toBeNull();
  expect(document.querySelectorAll('p a').length).toBe(links);
});

it('retains BHE even when the HE suffix is hidden', () => {
  expect(createTimestamp(document, parseDateSpans('12000 BC')[0], { removeHE: true, insertBetween: 'NOTHING' }).textContent).toBe('2000 BHE');
});
