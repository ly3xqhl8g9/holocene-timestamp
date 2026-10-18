// @vitest-environment jsdom
import { PageConverter } from '../src/page';
import { parserSettings, defaults } from '../src/settings';
import { parserOptions, type HoloceneTimestampParserOptions } from 'holocene-timestamp-parser';

const plain = parserSettings({ ...defaults, holoceneReplace: 'yesReplace', insertBetween: 'nothing', holoceneHeRemove: 'yesRemove' });
let converters: PageConverter[];
beforeEach(() => { converters = []; document.body.replaceChildren(); vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }); });
afterEach(() => { converters.forEach(converter => converter.stop()); vi.useRealTimers(); });
async function settle() { await Promise.resolve(); await vi.runAllTimersAsync(); await Promise.resolve(); }
async function start(html: string, options: HoloceneTimestampParserOptions = plain) {
  document.body.innerHTML = html;
  const converter = new PageConverter(document.body, options); converters.push(converter); converter.start();
  await settle(); return converter;
}

it('converts both endpoints even when the same year appears elsewhere', async () => {
  await start('<p>Michael Jackson (1958–2009)</p><p>Born in 1958; died in 2009.</p>');
  expect(document.body.textContent).toBe('Michael Jackson (11958–12009)Born in 11958; died in 12009.');
});

it('consumes a BC designation across inline elements, comments, and Unicode spaces', async () => {
  await start('<p><abbr>c.</abbr><span>\u2009470</span> –<!-- original citation --> 399<span>\u00a0</span><a id="era" href="/BC">BC</a></p>');
  expect(document.querySelector('p')!.textContent).toBe('c.\u20099531 – 9602');
  expect(document.querySelector('#era')?.getAttribute('href')).toBe('/BC');
});

it('preserves Wikipedia citations without losing the era of a range', async () => {
  await start('<p><span>470</span><sup class="reference"><a href="#note">[1]</a></sup>–399 <b>BC</b></p>');
  expect(document.querySelector('p')!.textContent).toBe('9531[1]–9602');
  expect(document.querySelector('sup a')!.getAttribute('href')).toBe('#note');
});

it('does not inherit an era across paragraph boundaries', async () => {
  await start('<p>470</p><p>399 BC</p>');
  expect([...document.querySelectorAll('p')].map(p => p.textContent)).toEqual(['470', '9602']);
});

it('preserves existing year links, attributes, and event listeners', async () => {
  document.body.innerHTML = '<p><a href="/1958">1958</a>–<a href="/2009">2009</a></p>';
  const link = document.querySelector('a')!; const click = vi.fn((event: Event) => event.preventDefault()); link.addEventListener('click', click);
  const converter = new PageConverter(document.body, plain); converters.push(converter); converter.start(); await settle();
  expect(document.querySelector('a')).toBe(link);
  expect(link.textContent).toBe('11958'); expect(link.getAttribute('href')).toBe('/1958');
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); expect(click).toHaveBeenCalledOnce();
  expect(document.querySelector('p')!.textContent).toBe('11958–12009');
});

it('leaves hidden date metadata and time attributes intact', async () => {
  await start('<p>Born <span class="bday">1958-08-29</span>August 29, 1958</p><time datetime="2026-10-17">17.10.2026</time>');
  expect(document.querySelector('.bday')!.textContent).toBe('1958-08-29');
  expect(document.querySelector('p')!.textContent).toContain('August 29, 11958');
  expect(document.querySelector('time')!.textContent).toBe('17.10.12026');
  expect(document.querySelector('time')!.getAttribute('datetime')).toBe('2026-10-17');
});

it('excludes editing, code, scripts, controls, and hidden content', async () => {
  await start('<p>2026</p><code>2026</code><pre>2026</pre><script>const year=2026;</script><textarea>2026</textarea><div contenteditable="true"><p>2026</p></div><div hidden>2026</div><p style="display:none">2026</p><input value="2026">');
  expect(document.querySelector('p')!.textContent).toBe('12026');
  for (const selector of ['code', 'pre', 'textarea', '[contenteditable]', '[hidden]', '[style]']) expect(document.querySelector(selector)!.textContent).toBe('2026');
  expect(document.querySelector('script')!.textContent).toBe('const year=2026;');
  expect(document.querySelector('input')!.value).toBe('2026');
});

it.each(['contenteditable', 'role'])('restores source text when a converted region becomes editable through %s', async attribute => {
  await start('<div id="editor"><p>470–399 BC</p></div>');
  const editor = document.querySelector('#editor')!;
  expect(editor.textContent).toBe('9531–9602');
  editor.setAttribute(attribute, attribute === 'role' ? 'textbox' : 'true'); await settle();
  expect(editor.textContent).toBe('470–399 BC');
  expect(editor.querySelector('[data-het]')).toBeNull();
  editor.removeAttribute(attribute); await settle();
  expect(editor.textContent).toBe('9531–9602');
});

it('restores inline regions that become hidden without altering visible neighboring dates', async () => {
  await start('<p><span id="date">1958</span> and 2009</p>');
  document.querySelector('#date')!.setAttribute('hidden', ''); await settle();
  expect(document.querySelector('#date')!.textContent).toBe('1958');
  expect(document.querySelector('p')!.textContent).toBe('1958 and 12009');
  document.querySelector('#date')!.removeAttribute('hidden'); await settle();
  expect(document.querySelector('p')!.textContent).toBe('11958 and 12009');
});

it('never interprets page text as HTML', async () => {
  const converter = await start('<p></p>');
  document.querySelector('p')!.textContent = '<img src=x onerror="alert(2026)"> in 2026'; await settle();
  converter.flush();
  expect(document.querySelector('img')).toBeNull();
  expect(document.querySelector('p')!.textContent).toBe('<img src=x onerror="alert(12026)"> in 12026');
});

it('converts new content and text updates without duplicating output', async () => {
  const converter = await start('<p id="first">2026</p>', parserOptions({ linkHE: false }));
  expect(document.querySelector('#first')!.textContent).toBe('2026 [12026 HE]');
  document.body.insertAdjacentHTML('beforeend', '<p id="new">470–399 <a href="/BC">BC</a></p>'); await settle();
  expect(document.querySelector('#new')!.textContent).toBe('470–399 BC [9531–9602 HE]');
  document.querySelector('#first')!.textContent = '2022'; await settle();
  expect(document.querySelector('#first')!.textContent).toBe('2022 [12022 HE]');
  converter.flush(); converter.flush(); await settle();
  expect(document.querySelector('#new')!.textContent).toBe('470–399 BC [9531–9602 HE]');
});

it('honors framework updates through their retained original text node', async () => {
  document.body.innerHTML = '<p>2026</p>';
  const text = document.querySelector('p')!.firstChild as Text;
  const converter = new PageConverter(document.body, plain); converters.push(converter); converter.start(); await settle();
  text.data = '2022'; await settle();
  expect(document.querySelector('p')!.textContent).toBe('12022');
});

it('handles an era that arrives in a later DOM update', async () => {
  await start('<p>470–399</p>');
  document.querySelector('p')!.append(' BC'); await settle();
  expect(document.querySelector('p')!.textContent).toBe('9531–9602');
});

it('recognizes a publication year in a time element without literal text spacing', async () => {
  await start('<time datetime="2026-10-17"><span>17 October</span><span>2026</span></time>');
  expect(document.querySelector('time')!.textContent).toBe('17 October12026');
});

it('preserves era context when a framework edits a nearby word in converted output', async () => {
  await start('<p>Born in 8000 BC</p>');
  expect(document.querySelector('p')!.textContent).toBe('Born in 2001');
  const output = document.querySelector('[data-het]')!;
  (output.firstChild as Text).data = 'Died in ';
  await settle();
  expect(document.querySelector('p')!.textContent).toBe('Died in 2001');
});

it('does not reinterpret dates when only generated text styling changes', async () => {
  await start('<p>Born in 8000 BC</p>');
  document.querySelector('[data-het]')!.setAttribute('class', 'highlighted'); await settle();
  expect(document.querySelector('p')!.textContent).toBe('Born in 2001');
});

it('italicizes the complete converted century while preserving surrounding prose', async () => {
  await start('<p>In the 19th century.</p>', { ...plain, styleHETimestamp: 'ITALIC' });
  expect(document.querySelector('p')!.textContent).toBe('In the 119th century.');
  expect([...document.querySelectorAll('i')].map(node => node.textContent).join('')).toBe('119th century');
});

it('never creates nested anchors', async () => {
  await start('<p><a href="/1958">1958</a></p>', parserOptions());
  expect(document.querySelector('a a')).toBeNull();
  expect(document.querySelector('p')!.textContent).toBe('1958 [11958 HE]');
  expect(document.querySelector('p > span a')?.getAttribute('href')).toBe('https://en.wikipedia.org/wiki/Holocene_calendar');
});

it('stops observing after shutdown', async () => {
  const converter = await start('<p>2026</p>'); converter.stop();
  document.body.insertAdjacentHTML('beforeend', '<p>2022</p>'); await settle();
  expect(document.body.lastElementChild!.textContent).toBe('2022');
});
