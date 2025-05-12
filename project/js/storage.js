/**
 * Storage utility for the Age Counter extension
 */
class Storage {
  static async get(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }

  static async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  static async getAll() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (result) => {
        resolve(result);
      });
    });
  }

  static async clear() {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        resolve();
      });
    });
  }
}

/**
 * Default settings for the extension
 */
const DEFAULT_SETTINGS = {
  name: '',
  birthday: null,
  theme: 'midnight',
  font: 'montserrat',
  layout: 'minimal',
  showMilliseconds: true,
  showLabels: true,
  colorScheme: 'blue',
  animationSpeed: 'normal',
  updateInterval: 100, // Milliseconds between updates
};

/**
 * Initialize settings if they don't exist
 */
async function initSettings() {
  const settings = await Storage.getAll();
  
  if (!settings || Object.keys(settings).length === 0) {
    await Storage.set('settings', DEFAULT_SETTINGS);
  }
}

/**
 * Get settings
 */
async function getSettings() {
  let settings = await Storage.get('settings');
  
  if (!settings) {
    settings = DEFAULT_SETTINGS;
    await Storage.set('settings', settings);
  }
  
  return settings;
}

/**
 * Save settings
 */
async function saveSettings(settings) {
  await Storage.set('settings', settings);
}

// Initialize settings when the script is loaded
initSettings();