import { initializeSettings } from './settings';

chrome.runtime.onInstalled.addListener(() => {
  void initializeSettings().catch(error => console.error('Holocene Timestamp could not initialize preferences.', error));
});
