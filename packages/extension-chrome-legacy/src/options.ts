import { choices, defaults, loadSettings, normalizeSettings, type Settings } from './settings';

export async function initializeOptions(document: Document = window.document): Promise<void> {
  let settings = await loadSettings();
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
  const read = (): Settings => normalizeSettings(Object.fromEntries(Object.entries(choices).map(([key, values]) => [key,
    values.find(value => (document.getElementById(value) as HTMLInputElement).checked),
  ])));

  function dependencies(): void {
    const values = read();
    for (const input of inputs) {
      const activation = choices.activeOptions.includes(input.value as Settings['activeOptions']);
      input.disabled = !activation && (values.activeOptions === 'off'
        || (choices.insertBefore.includes(input.value as Settings['insertBefore']) && values.holoceneReplace === 'yesReplace')
        || (choices.holoceneAnchor.includes(input.value as Settings['holoceneAnchor']) && values.holoceneHeRemove === 'yesRemove'));
    }
  }
  function render(): void {
    for (const input of inputs) input.checked = Object.values(settings).includes(input.value as Settings[keyof Settings]);
    dependencies();
  }
  for (const input of inputs) input.addEventListener('change', dependencies);
  document.getElementById('OptionsForm')!.addEventListener('submit', event => event.preventDefault());
  async function save(reset: boolean): Promise<void> {
    const status = document.getElementById(reset ? 'status-default' : 'status-save')!;
    const button = document.getElementById(reset ? 'btn-reset' : 'btn-save') as HTMLButtonElement;
    button.disabled = true;
    try {
      const values = reset ? { ...defaults } : read();
      await chrome.storage.sync.set(values);
      settings = values;
      render();
      status.textContent = reset ? 'Options are default.' : 'Options are saved.';
      window.setTimeout(() => { status.textContent = ''; }, 750);
    } catch {
      status.textContent = 'Options could not be saved. Please try again.';
    } finally { button.disabled = false; }
  }
  document.getElementById('btn-save')!.addEventListener('click', event => { event.preventDefault(); void save(false); });
  document.getElementById('btn-reset')!.addEventListener('click', event => { event.preventDefault(); void save(true); });
  render();
}

if (document.getElementById('OptionsForm')) void initializeOptions().catch(error => {
  document.getElementById('status-save')!.textContent = 'Options could not be loaded. Please try again.';
  console.error('Holocene Timestamp could not load preferences.', error);
});
