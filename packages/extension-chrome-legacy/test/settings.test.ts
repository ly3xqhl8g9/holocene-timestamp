import { defaults, initializeSettings, isActive, loadSettings, normalizeSettings, parserSettings } from '../src/settings';

afterEach(() => vi.unstubAllGlobals());
it('preserves valid choices while filling only absent or invalid settings', () => {
  expect(normalizeSettings({ holoceneHeRemove: 'yesRemove', holoceneReplace: 'yesReplace', insertBetween: 'broken' })).toEqual({ ...defaults, holoceneHeRemove: 'yesRemove', holoceneReplace: 'yesReplace' });
});
it('initializes missing keys without overwriting existing preferences', async () => {
  const values = { ...defaults, holoceneHeRemove: 'yesRemove' } as Record<string, unknown>;
  delete values.insertBetween;
  const set = vi.fn(async () => {});
  vi.stubGlobal('chrome', { storage: { sync: { get: async () => values, set } } });
  await initializeSettings(); expect(set).toHaveBeenCalledWith({ insertBetween: 'brackets' });
});
it('needs no storage writes before a fresh installation can convert dates', async () => {
  const set = vi.fn(); vi.stubGlobal('chrome', { storage: { sync: { get: async () => ({}), set } } });
  expect(await loadSettings()).toEqual(defaults); expect(set).not.toHaveBeenCalled();
});
it('propagates storage failures without resetting saved preferences', async () => {
  const set = vi.fn(); vi.stubGlobal('chrome', { storage: { sync: { get: async () => { throw new Error('unavailable'); }, set } } });
  await expect(loadSettings()).rejects.toThrow('unavailable'); expect(set).not.toHaveBeenCalled();
});
it.each([
  ['en.wikipedia.org', true], ['no.wikipedia.org', true], ['en.m.wikipedia.org', true],
  ['wikipedia.org.attacker.example', false], ['notwikipedia.org', false], ['bbc.com', false],
])('matches Wikipedia by hostname: %s', (hostname, expected) => expect(isActive(defaults, hostname)).toBe(expected));
it('supports all-site and off modes consistently', () => {
  expect(isActive({ ...defaults, activeOptions: 'onSite' }, 'google.com')).toBe(true);
  expect(isActive({ ...defaults, activeOptions: 'off' }, 'en.wikipedia.org')).toBe(false);
});
it('maps every legacy preference to the shared formatter', () => {
  expect(parserSettings({ ...defaults, insertBefore: 'before', insertBetween: 'slashes', holoceneStyle: 'italic', holoceneAnchor: 'noAnchor', holoceneHeRemove: 'yesRemove', holoceneReplace: 'yesReplace' })).toEqual({ insertLocation: 'BEFORE', insertBetween: 'SLASHES', styleHETimestamp: 'ITALIC', linkHE: false, removeHE: true, replaceTimestamp: true });
});
