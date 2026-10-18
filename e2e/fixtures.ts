import { test as base, expect, type BrowserContext, type Worker } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const test = base.extend<{ context: BrowserContext; extensionId: string; worker: Worker }>({
  context: async ({ playwright }, use) => {
    const profile = await mkdtemp(path.join(tmpdir(), 'holocene-e2e-'));
    const extension = path.resolve('packages/extension-chrome-legacy/distribution');
    let context: BrowserContext | undefined;
    try {
      context = await playwright.chromium.launchPersistentContext(profile, {
        channel: 'chromium', headless: true,
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
      });
      await use(context);
    } finally { await context?.close(); await rm(profile, { recursive: true, force: true }); }
  },
  worker: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    await expect.poll(() => worker.evaluate(() => chrome.storage.sync.get('activeOptions'))).toEqual({ activeOptions: 'onWiki' });
    await use(worker);
  },
  extensionId: async ({ worker }, use) => { await use(new URL(worker.url()).host); },
});
export { expect } from '@playwright/test';
