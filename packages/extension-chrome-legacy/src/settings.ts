import type { HoloceneTimestampParserOptions } from 'holocene-timestamp-parser';

export const choices = {
  activeOptions: ['onWiki', 'onSite', 'off'],
  insertBefore: ['after', 'before'],
  insertBetween: ['brackets', 'accolades', 'slashes', 'nothing'],
  holoceneStyle: ['regular', 'italic'],
  holoceneAnchor: ['yesAnchor', 'noAnchor'],
  holoceneHeRemove: ['noRemove', 'yesRemove'],
  holoceneReplace: ['noReplace', 'yesReplace'],
} as const;
export type Settings = { [K in keyof typeof choices]: typeof choices[K][number] };
export const defaults: Settings = {
  activeOptions: 'onWiki', insertBefore: 'after', insertBetween: 'brackets',
  holoceneStyle: 'regular', holoceneAnchor: 'yesAnchor',
  holoceneHeRemove: 'noRemove', holoceneReplace: 'noReplace',
};

export function normalizeSettings(values: Record<string, unknown>): Settings {
  return Object.fromEntries(Object.entries(choices).map(([key, allowed]) => [
    key, (allowed as readonly unknown[]).includes(values[key]) ? values[key] : defaults[key as keyof Settings],
  ])) as Settings;
}

export async function loadSettings(): Promise<Settings> {
  return normalizeSettings(await chrome.storage.sync.get(Object.keys(defaults)));
}

export async function initializeSettings(): Promise<void> {
  const current = await chrome.storage.sync.get(Object.keys(defaults));
  const settings = normalizeSettings(current);
  const missing = Object.fromEntries(Object.entries(settings).filter(([key, value]) => current[key] !== value));
  if (Object.keys(missing).length) await chrome.storage.sync.set(missing);
}

export function parserSettings(settings: Settings): HoloceneTimestampParserOptions {
  return {
    insertLocation: settings.insertBefore === 'before' ? 'BEFORE' : 'AFTER',
    insertBetween: ({ brackets: 'BRACKETS', accolades: 'ACCOLADES', slashes: 'SLASHES', nothing: 'NOTHING' } as const)[settings.insertBetween],
    styleHETimestamp: settings.holoceneStyle === 'italic' ? 'ITALIC' : 'REGULAR',
    linkHE: settings.holoceneAnchor === 'yesAnchor',
    removeHE: settings.holoceneHeRemove === 'yesRemove',
    replaceTimestamp: settings.holoceneReplace === 'yesReplace',
  };
}

export function isActive(settings: Settings, hostname: string): boolean {
  return settings.activeOptions === 'onSite' || (settings.activeOptions === 'onWiki'
    && (hostname === 'wikipedia.org' || hostname.endsWith('.wikipedia.org')));
}
