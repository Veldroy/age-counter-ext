/**
 * Age Counter Popup Script
 */
let counter;

// DOM Elements
const counterDisplay = document.getElementById('counter-display');
const setupPrompt = document.getElementById('setup-prompt');
const birthdateInput = document.getElementById('birthdate');
const saveBirthdateButton = document.getElementById('save-birthdate');
const openSettingsButton = document.getElementById('open-settings');
const openCounterButton = document.getElementById('open-counter');
const birthdateDisplay = document.getElementById('birthdate-display');
const totalSecondsElement = document.getElementById('total-seconds');
const yearsElement = document.getElementById('years');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');

// Initialize the popup
async function initPopup() {
  const settings = await getSettings();
  
  if (settings.birthday) {
    setupCounter(settings.birthday);
    setupPrompt.style.display = 'none';
    counterDisplay.style.display = 'flex';
    
    // Format and display birthdate
    const birthdate = new Date(settings.birthday);
    birthdateDisplay.textContent = birthdate.toLocaleString();
  } else {
    setupPrompt.style.display = 'flex';
    counterDisplay.style.display = 'none';
  }
}

// Setup the counter with a birthdate
function setupCounter(birthdate) {
  counter = new AgeCounter(birthdate);
  
  counter.addListener(updateCounterDisplay);
  counter.start(100); // Update every 100ms
}

// Update the counter display with new values
function updateCounterDisplay(age) {
  yearsElement.textContent = age.years;
  daysElement.textContent = age.days;
  hoursElement.textContent = age.hours;
  totalSecondsElement.textContent = age.totalSeconds.toLocaleString();
}

// Event Listeners
saveBirthdateButton.addEventListener('click', async () => {
  const birthdate = birthdateInput.value;
  
  if (!birthdate) {
    alert('Please enter your birthdate');
    return;
  }
  
  const settings = await getSettings();
  settings.birthday = new Date(birthdate).toISOString();
  await saveSettings(settings);
  
  setupCounter(settings.birthday);
  setupPrompt.style.display = 'none';
  counterDisplay.style.display = 'flex';
  
  // Format and display birthdate
  const birthdateObj = new Date(birthdate);
  birthdateDisplay.textContent = birthdateObj.toLocaleString();
});

openSettingsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

openCounterButton.addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://newtab/' });
});

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initPopup);