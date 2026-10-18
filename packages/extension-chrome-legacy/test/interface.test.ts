// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { initializeOptions } from '../src/options';
import { initializePopup } from '../src/popup';
import { defaults } from '../src/settings';

let saved: Record<string, unknown>;
let set: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers(); saved = { ...defaults };
  set = vi.fn(async (values: Record<string, unknown>) => { Object.assign(saved, values); });
  vi.stubGlobal('chrome', { storage: { sync: { get: async () => ({ ...saved }), set } }, runtime: { openOptionsPage: vi.fn(async () => {}) } });
});
afterEach(() => { document.body.replaceChildren(); vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });
function template(name: string) { document.documentElement.innerHTML = readFileSync(`${process.cwd()}/packages/extension-chrome-legacy/src/${name}.html`, 'utf8'); }
const input = (id: string) => document.getElementById(id) as HTMLInputElement;

it('restores saved preferences and respects both dependent disabled groups', async () => {
  template('options'); saved = { ...defaults, holoceneReplace: 'yesReplace', holoceneHeRemove: 'yesRemove' };
  await initializeOptions(); expect(input('yesReplace').checked).toBe(true); expect(input('yesRemove').checked).toBe(true);
  expect(input('before').disabled).toBe(true); expect(input('yesAnchor').disabled).toBe(true);
  input('off').click(); expect(input('italic').disabled).toBe(true);
  input('onSite').click(); expect(input('italic').disabled).toBe(false);
  expect(input('before').disabled).toBe(true); expect(input('noAnchor').disabled).toBe(true);
  expect(set).not.toHaveBeenCalled();
});

it('saves the selected values before acknowledging success', async () => {
  template('options'); await initializeOptions();
  input('nothing').click(); input('yesReplace').click(); input('yesRemove').click();
  document.getElementById('btn-save')!.click();
  await vi.waitFor(() => expect(document.getElementById('status-save')!.textContent).toBe('Options are saved.'));
  expect(saved).toEqual({ ...defaults, insertBetween: 'nothing', holoceneReplace: 'yesReplace', holoceneHeRemove: 'yesRemove' });
  expect(input('yesReplace').checked).toBe(true); expect(input('nothing').checked).toBe(true);
});

it('keeps the form intact on save failure and uses the existing status area', async () => {
  template('options'); await initializeOptions(); set.mockRejectedValueOnce(new Error('quota'));
  input('yesRemove').click(); document.getElementById('btn-save')!.click();
  await vi.waitFor(() => expect(document.getElementById('status-save')!.textContent).toContain('could not be saved'));
  expect(saved).toEqual(defaults); expect(input('yesRemove').checked).toBe(true);
  expect((document.getElementById('btn-save') as HTMLButtonElement).disabled).toBe(false);
});

it('reset restores defaults after the write completes', async () => {
  template('options'); saved = { ...defaults, activeOptions: 'off', holoceneReplace: 'yesReplace' };
  await initializeOptions(); document.getElementById('btn-reset')!.click();
  await vi.waitFor(() => expect(saved).toEqual(defaults));
  expect(input('onWiki').checked).toBe(true); expect(input('noReplace').checked).toBe(true); expect(input('before').disabled).toBe(false);
});

it('the popup selects every-site mode correctly and previews the stored formatting', async () => {
  template('popup'); saved = { ...defaults, holoceneReplace: 'yesReplace', holoceneHeRemove: 'yesRemove', insertBetween: 'nothing' };
  await initializePopup(); expect(input('extensionOnWiki').checked).toBe(true);
  expect(document.querySelector('.leftTable')!.textContent).toBe('2027');
  expect(document.getElementById('firstHE')!.textContent).toBe('12027'); expect(document.getElementById('secondHE')!.textContent).toBe('9602');
  document.getElementById('radioButtonOnSite')!.click();
  await vi.waitFor(() => expect(input('extensionOnSite').checked).toBe(true));
  expect(input('extensionOnWiki').checked).toBe(false); expect(saved.activeOptions).toBe('onSite');
  document.getElementById('radioButtonOff')!.click();
  await vi.waitFor(() => expect(document.getElementById('underForm')!.style.display).toBe('none'));
  expect(saved.activeOptions).toBe('off');
});

it('a missing preference never resets the remaining saved choices', async () => {
  template('popup'); saved = { activeOptions: 'onSite', holoceneReplace: 'yesReplace', holoceneHeRemove: 'yesRemove' };
  await initializePopup(); expect(input('extensionOnSite').checked).toBe(true); expect(document.getElementById('firstHE')!.textContent).toBe('[12027]');
  expect(set).not.toHaveBeenCalled(); expect(saved.holoceneReplace).toBe('yesReplace');
});
