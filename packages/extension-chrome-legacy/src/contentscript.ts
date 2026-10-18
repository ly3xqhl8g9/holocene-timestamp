import { loadSettings, parserSettings, isActive } from './settings';
import { PageConverter } from './page';

async function start(): Promise<void> {
  const settings = await loadSettings();
  if (document.body && isActive(settings, window.location.hostname)) {
    const converter = new PageConverter(document.body, parserSettings(settings));
    converter.start();
    window.addEventListener('pagehide', () => converter.stop());
    window.addEventListener('pageshow', event => { if (event.persisted) converter.start(); });
  }
}

void start().catch(error => console.error('Holocene Timestamp could not start.', error));
