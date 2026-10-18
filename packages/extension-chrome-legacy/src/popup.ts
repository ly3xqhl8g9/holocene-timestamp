import { loadSettings, type Settings, parserSettings } from './settings';
import { parseDateSpans } from 'holocene-timestamp-parser';
import { createTimestamp } from './render';

export async function initializePopup(document: Document = window.document): Promise<void> {
  let settings = await loadSettings();
  const modes = { off: 'Off', onWiki: 'OnWiki', onSite: 'OnSite' } as const;

  function render(): void {
    const active = settings.activeOptions !== 'off';
    document.getElementById('popupTitle')!.textContent = `The Holocene Epoch Timestamp is${active ? ' active' : ''}`;
    document.getElementById('underForm')!.style.display = active ? 'block' : 'none';
    for (const [mode, id] of Object.entries(modes)) {
      (document.getElementById(`extension${id}`) as HTMLInputElement).checked = settings.activeOptions === mode;
      document.getElementById(`radioButton${id}`)!.style.background = settings.activeOptions === mode
        ? 'rgb(12, 57, 87)' : 'linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)';
    }
    const options = parserSettings(settings);
    for (const [id, source] of [['firstHE', '2027'], ['secondHE', '399 BC']]) {
      const target = document.getElementById(id)!;
      const timestamp = createTimestamp(document, parseDateSpans(source)[0], options);
      target.replaceChildren();
      if (options.replaceTimestamp) target.append(timestamp);
      else if (options.insertLocation === 'BEFORE') target.append(timestamp, ` ${source}`);
      else target.append(`${source} `, timestamp);
    }
  }

  async function select(mode: Settings['activeOptions']): Promise<void> {
    try {
      await chrome.storage.sync.set({ activeOptions: mode });
      settings = { ...await loadSettings(), activeOptions: mode };
      render();
    } catch {
      document.getElementById('popupTitle')!.textContent = 'Options could not be saved.';
    }
  }
  for (const [mode, id] of Object.entries(modes)) {
    document.getElementById(`extension${id}`)!.addEventListener('change', () => { void select(mode as Settings['activeOptions']); });
    document.getElementById(`radioButton${id}`)!.addEventListener('click', () => { void select(mode as Settings['activeOptions']); });
  }
  document.getElementById('adjustOptions')!.addEventListener('click', () => { void chrome.runtime.openOptionsPage(); });
  render();
}

if (document.getElementById('popupTitle')) void initializePopup().catch(error => {
  document.getElementById('popupTitle')!.textContent = 'Options could not be loaded.';
  console.error('Holocene Timestamp could not load preferences.', error);
});
