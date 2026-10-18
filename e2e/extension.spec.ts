import { test, expect } from './fixtures';
import { defaults } from '../packages/extension-chrome-legacy/src/settings';

const plain = { ...defaults, activeOptions: 'onSite', insertBetween: 'nothing', holoceneReplace: 'yesReplace', holoceneHeRemove: 'yesRemove' };
const htmlContentType = 'text/html; charset=utf-8';
const example = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Date conversion fixtures</title><body>
  <p id="norwegian">Michael Jackson (1958–2009), i 1960-årene og 1980-årene.</p>
  <p id="english"><span class="bday" hidden>1958-08-29</span>August 29, 1958 – June 25, 2009</p>
  <p id="socrates"><abbr>c.</abbr><span>\u2009470</span> – 399<span>\u00a0</span><a href="/BC">BC</a></p>
  <time id="bbc" datetime="2026-10-17T11:30:00Z">17 October 2026</time>
  <time id="bbc-old" datetime="2022-01-01">1 January 2022</time>
  <p id="forskning">17.10.2026</p><p id="quantity">2026 km, $1958, ISBN 978-1-2026-1958-0</p>
  <p id="audit">2026-10-17 BC; 12,345 BC; 2026-10; 10/17/2026; BC 1 January 2026; 2026-10-170</p>
  <p id="already-he">1960-årene HE; 19th century HE; 2026-10-17 HE</p>
  <h2 id="bbc-since">Netflix to shed 1,000 jobs in steepest cuts since 2022</h2>
  <p id="last">2026</p></body></html>`;

test('production extension fixes every reported date shape', async ({ context, page, worker }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await worker.evaluate(values => chrome.storage.sync.set(values), plain);
  await context.route('https://fixture.het.test/**', route => route.fulfill({ contentType: htmlContentType, body: example }));
  await page.goto('https://fixture.het.test/article');
  await expect(page.locator('#norwegian')).toHaveText('Michael Jackson (11958–12009), i 11960-årene og 11980-årene.');
  await expect(page.locator('#english')).toHaveText('1958-08-29August 29, 11958 – June 25, 12009');
  await expect(page.locator('#socrates')).toHaveText('c.\u20099531 – 9602');
  await expect(page.locator('#bbc')).toHaveText('17 October 12026');
  await expect(page.locator('#bbc-old')).toHaveText('1 January 12022');
  await expect(page.locator('#bbc')).toHaveAttribute('datetime', '2026-10-17T11:30:00Z');
  await expect(page.locator('#forskning')).toHaveText('17.10.12026');
  await expect(page.locator('#quantity')).toHaveText('2026 km, $1958, ISBN 978-1-2026-1958-0');
  await expect(page.locator('#audit')).toHaveText('7975-10-17; 2345 BHE; 12026-10; 10/17/12026; 1 January 7975; 2026-10-170');
  await expect(page.locator('#already-he')).toHaveText('1960-årene HE; 19th century HE; 2026-10-17 HE');
  await expect(page.locator('#bbc-since')).toHaveText('Netflix to shed 1,000 jobs in steepest cuts since 12022');
  await expect(page.locator('#last')).toHaveText('12026');
  expect(errors).toEqual([]);
});

test('fresh-install defaults, popup selection, and options persistence work', async ({ context, page, worker, extensionId }, testInfo) => {
  await expect.poll(() => worker.evaluate(() => chrome.storage.sync.get('activeOptions'))).toEqual({ activeOptions: 'onWiki' });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('#extensionOnWiki')).toBeChecked();
  await expect(page.locator('#firstHE')).toHaveText('2027 [12027 HE]');
  await page.screenshot({ path: testInfo.outputPath('popup-default.png') });
  await page.locator('label[for="extensionOnSite"]').click();
  await expect(page.locator('#extensionOnSite')).toBeChecked();
  await expect.poll(() => worker.evaluate(() => chrome.storage.sync.get('activeOptions'))).toEqual({ activeOptions: 'onSite' });

  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await expect(page.locator('#onSite')).toBeChecked();
  await page.locator('#yesReplace').check(); await page.locator('#yesRemove').check(); await page.locator('#nothing').check();
  await expect(page.locator('#before')).toBeDisabled(); await expect(page.locator('#yesAnchor')).toBeDisabled();
  await page.locator('#btn-save').click(); await expect(page.locator('#status-save')).toHaveText('Options are saved.');
  await page.reload(); await expect(page.locator('#yesReplace')).toBeChecked(); await expect(page.locator('#yesRemove')).toBeChecked();
  await expect(page.locator('#nothing')).toBeChecked(); await expect(page.locator('#before')).toBeDisabled();
  await page.screenshot({ path: testInfo.outputPath('options-saved.png'), fullPage: true });

  await context.route('https://fixture.het.test/**', route => route.fulfill({ contentType: htmlContentType, body: '<p>2026</p>' }));
  const article = await context.newPage(); await article.goto('https://fixture.het.test/'); await expect(article.locator('p')).toHaveText('12026');
  await page.locator('#btn-reset').click(); await expect(page.locator('#status-default')).toHaveText('Options are default.');
  await expect(page.locator('#onWiki')).toBeChecked(); await expect(page.locator('#noReplace')).toBeChecked();
});

test('Wikipedia mode checks the hostname and off mode stays inactive', async ({ context, page, worker }) => {
  await worker.evaluate(values => chrome.storage.sync.set(values), { ...plain, activeOptions: 'onWiki' });
  await context.route('https://**/*', route => route.fulfill({ contentType: htmlContentType, body: '<p>2026</p>' }));
  await page.goto('https://en.wikipedia.org/fixture'); await expect(page.locator('p')).toHaveText('12026');
  await page.goto('https://wikipedia.org.attacker.het.test/fixture'); await expect(page.locator('p')).toHaveText('2026');
  await worker.evaluate(() => chrome.storage.sync.set({ activeOptions: 'off' }));
  await page.goto('https://en.wikipedia.org/fixture'); await expect(page.locator('p')).toHaveText('2026');
});

test('dynamic content is converted once and remains interactive', async ({ context, page, worker }) => {
  await worker.evaluate(values => chrome.storage.sync.set(values), plain);
  await context.route('https://fixture.het.test/**', route => route.fulfill({ contentType: htmlContentType, body: '<p id="date">2026</p><main></main>' }));
  await page.goto('https://fixture.het.test/'); await expect(page.locator('#date')).toHaveText('12026');
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML = '<p><a id="year" href="#clicked">1958</a>–2009</p><p id="bc">470–399 <i>BC</i></p>';
    document.querySelector('#year')!.addEventListener('click', () => document.body.setAttribute('data-clicked', 'yes'));
    document.querySelector('#date')!.textContent = '2022';
  });
  await expect(page.locator('main p').first()).toHaveText('11958–12009'); await expect(page.locator('#bc')).toHaveText('9531–9602');
  await expect(page.locator('#date')).toHaveText('12022');
  await page.locator('#year').click(); await expect(page.locator('body')).toHaveAttribute('data-clicked', 'yes');
  await page.evaluate(() => document.querySelector('main')!.append(document.createElement('hr')));
  await expect(page.locator('#bc')).toHaveText('9531–9602');
  await page.locator('#bc').evaluate(element => element.setAttribute('contenteditable', 'true'));
  await expect(page.locator('#bc')).toHaveText('470–399 BC');
  await expect(page.locator('#bc [data-het]')).toHaveCount(0);
  await page.locator('#bc').evaluate(element => element.removeAttribute('contenteditable'));
  await expect(page.locator('#bc')).toHaveText('9531–9602');
});

test('a large article yields between batches', async ({ context, page, worker }) => {
  await worker.evaluate(values => chrome.storage.sync.set(values), plain);
  // A period directly after BC is part of that era abbreviation; keep sentence punctuation outside it.
  const paragraphs = Array.from({ length: 2000 }, (_, index) => `<p id="p${index}">1958–2009, the 1960s, (470–399 BC).</p>`).join('');
  await context.route('https://fixture.het.test/**', route => route.fulfill({ contentType: htmlContentType, body: `<script>window.ticks=0;setInterval(()=>window.ticks++,0)</script>${paragraphs}` }));
  await page.goto('https://fixture.het.test/');
  expect(await page.evaluate(() => document.characterSet)).toBe('UTF-8');
  await expect(page.locator('#p1999')).toHaveText('11958–12009, the 11960s, (9531–9602).', { timeout: 20_000 });
  expect(await page.evaluate(() => (window as unknown as { ticks: number }).ticks)).toBeGreaterThan(1);
});
