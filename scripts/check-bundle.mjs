import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const directory = new URL('packages/extension-chrome-legacy/distribution/', root);
const script = await readFile(new URL('contentscript.js', directory), 'utf8');
const values = { activeOptions: 'onSite', insertBefore: 'after', insertBetween: 'nothing', holoceneStyle: 'regular', holoceneAnchor: 'yesAnchor', holoceneHeRemove: 'yesRemove', holoceneReplace: 'yesReplace' };
const dom = new JSDOM(`<!doctype html><html><body>
  <p id="range">1958–2009. Born in 1958; died in 2009.</p>
  <p id="english">August 29, 1958 – June 25, 2009</p>
  <p id="decades">1960s and 1980-årene</p>
  <p id="bc"><abbr>c.</abbr><span>\u2009470</span> – 399<span>\u00a0</span><a href="/BC">BC</a></p>
  <time id="bbc" datetime="2026-10-17">17 October 2026</time>
  <p id="forskning">17.10.2026</p><p id="quantity">2026 km, $1958</p><main></main>
  <p id="audit">2026-10-17 BC; 12,345 BC; 2026-10; 10/17/2026; BC 1 January 2026; 2026-10-170</p>
  <p id="already-he">1960-årene HE; 19th century HE; 2026-10-17 HE</p>
  <h2 id="bbc-since">Netflix to shed 1,000 jobs in steepest cuts since 2022</h2>
  </body></html>`, { url: 'https://fixture.het.test/', runScripts: 'outside-only', pretendToBeVisual: true });
try {
  dom.window.chrome = { storage: { sync: { get: async () => values } } };
  dom.window.eval(script);
  const document = dom.window.document;
  const wait = async (predicate, failure = 'Production bundle did not finish converting.') => {
    const deadline = Date.now() + 5000;
    while (!predicate()) { if (Date.now() > deadline) throw new Error(failure); await new Promise(resolve => setTimeout(resolve, 10)); }
  };
  for (const [id, expected] of [
    ['range', '11958–12009. Born in 11958; died in 12009.'],
    ['english', 'August 29, 11958 – June 25, 12009'],
    ['decades', '11960s and 11980-årene'], ['bc', 'c.\u20099531 – 9602'],
    ['bbc', '17 October 12026'], ['forskning', '17.10.12026'], ['quantity', '2026 km, $1958'],
    ['audit', '7975-10-17; 2345 BHE; 12026-10; 10/17/12026; 1 January 7975; 2026-10-170'],
    ['already-he', '1960-årene HE; 19th century HE; 2026-10-17 HE'],
    ['bbc-since', 'Netflix to shed 1,000 jobs in steepest cuts since 12022'],
  ]) {
    await wait(() => document.getElementById(id).textContent === expected, `${id} did not become ${JSON.stringify(expected)}.`);
    assert.equal(document.getElementById(id).textContent, expected, id);
  }
  assert.equal(document.getElementById('bbc').getAttribute('datetime'), '2026-10-17');
  document.querySelector('main').innerHTML = '<p id="new">470–399 <b>BC</b></p>';
  await wait(() => document.getElementById('new').textContent === '9531–9602');
  document.getElementById('bbc').textContent = '1 January 2022';
  await wait(() => document.getElementById('bbc').textContent === '1 January 12022');
  document.getElementById('new').setAttribute('contenteditable', 'true');
  await wait(() => document.getElementById('new').textContent === '470–399 BC');
  assert.equal(document.getElementById('new').querySelector('[data-het]'), null);
  document.getElementById('new').removeAttribute('contenteditable');
  await wait(() => document.getElementById('new').textContent === '9531–9602');
} finally { dom.window.close(); }

const require = createRequire(import.meta.url);
const library = require(fileURLToPath(new URL('packages/holocene-timestamp-parser/dist/holocene-timestamp-parser.umd.js', root)));
assert.equal(new library.default('470–399 BC').text({ replaceTimestamp: true, removeHE: true, insertBetween: 'NOTHING' }).HE, '9531–9602');
assert.deepEqual(library.gregorianToHolocene({ value: 10000, type: 'BC' }), { value: 1, type: 'HE' });
console.log('Production content-script and public UMD library smoke checks passed (DOM simulation; browser end-to-end checks are separate).');
