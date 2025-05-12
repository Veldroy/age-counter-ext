/**
 * Age Counter New Tab Page Script
 */
let counter;
let particles = [];
let lastUpdate = 0;
const UPDATE_THRESHOLD = 16; // ~60fps

// DOM elements
const setupPrompt = document.getElementById('setup-prompt');
const counterDisplay = document.getElementById('counter');
const greeting = document.getElementById('greeting');
const nameInput = document.getElementById('name');
const birthYearInput = document.getElementById('birthYear');
const birthMonthInput = document.getElementById('birthMonth');
const birthDayInput = document.getElementById('birthDay');
const saveBirthdateButton = document.getElementById('save-birthdate');
const openSettingsButton = document.getElementById('open-settings');
const totalSecondsElement = document.getElementById('total-seconds');

// Counter elements
const yearsElement = document.getElementById('years');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');

// Initialize the page
async function initPage() {
  const settings = await getSettings();
  populateDayOptions();
  
  if (settings.birthday && settings.name) {
    setupCounter(settings.birthday);
    updateGreeting(settings.name);
    setupPrompt.style.display = 'none';
    counterDisplay.style.display = 'block';
  } else {
    setupPrompt.style.display = 'block';
    counterDisplay.style.display = 'none';
  }
  
  // Apply theme and layout
  applyTheme(settings.theme, settings.colorScheme, settings.font);
  applyLayout(settings.layout, counterDisplay);
}

// Update greeting based on time of day
function updateGreeting(name) {
  const hour = new Date().getHours();
  let greetingText = '';
  
  if (hour >= 5 && hour < 12) {
    greetingText = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    greetingText = 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    greetingText = 'Good evening';
  } else {
    greetingText = 'Good night';
  }
  
  greeting.textContent = `${greetingText}, ${name}`;
}

// Populate day options based on selected month
function populateDayOptions() {
  const month = parseInt(birthMonthInput.value);
  const year = birthYearInput.value ? parseInt(birthYearInput.value) : new Date().getFullYear();
  
  // Clear existing options
  birthDayInput.innerHTML = '<option value="">Day</option>';
  
  if (month === '') return;
  
  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Add day options
  for (let i = 1; i <= daysInMonth; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    birthDayInput.appendChild(option);
  }
}

// Setup the counter with optimized performance
function setupCounter(birthdate) {
  counter = new AgeCounter(birthdate);
  
  counter.addListener((age) => {
    const now = performance.now();
    if (now - lastUpdate >= UPDATE_THRESHOLD) {
      updateCounterDisplay(age);
      lastUpdate = now;
    }
  });
  
  counter.start(50);
}

// Update the counter display with new values
function updateCounterDisplay(age) {
  requestAnimationFrame(() => {
    yearsElement.textContent = age.years;
    daysElement.textContent = age.days;
    hoursElement.textContent = age.hours;
    minutesElement.textContent = age.minutes;
    secondsElement.textContent = age.seconds;
    millisecondsElement.textContent = age.milliseconds.toString().padStart(3, '0');
    totalSecondsElement.textContent = age.totalSeconds.toLocaleString();
  });
}

// Event Listeners
birthYearInput.addEventListener('change', populateDayOptions);
birthMonthInput.addEventListener('change', populateDayOptions);

saveBirthdateButton.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  const year = birthYearInput.value;
  const month = birthMonthInput.value;
  const day = birthDayInput.value;
  
  if (!name || !year || month === '' || !day) {
    alert('Please fill in all fields');
    return;
  }
  
  const birthdate = new Date(year, month, day);
  const settings = await getSettings();
  
  settings.name = name;
  settings.birthday = birthdate.toISOString();
  await saveSettings(settings);
  
  setupCounter(settings.birthday);
  updateGreeting(settings.name);
  setupPrompt.style.display = 'none';
  counterDisplay.style.display = 'block';
});

openSettingsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Update greeting every minute
setInterval(() => {
  getSettings().then(settings => {
    if (settings.name) {
      updateGreeting(settings.name);
    }
  });
}, 60000);

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);