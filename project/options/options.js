/**
 * Age Counter Options Page Script
 */

// DOM Elements
const settingsForm = document.getElementById('settings-form');
const birthdateInput = document.getElementById('birthdate');
const themeSelect = document.getElementById('theme');
const colorSchemeSelect = document.getElementById('colorScheme');
const fontSelect = document.getElementById('font');
const layoutSelect = document.getElementById('layout');
const showMillisecondsToggle = document.getElementById('showMilliseconds');
const showLabelsToggle = document.getElementById('showLabels');
const animationSpeedSelect = document.getElementById('animationSpeed');
const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');
const previewContainer = document.getElementById('preview-container');

// Initialize the options page
async function initOptions() {
  const settings = await getSettings();
  
  // Fill in current settings
  if (settings.birthday) {
    // Convert to local datetime format for the input
    const birthdate = new Date(settings.birthday);
    const year = birthdate.getFullYear();
    const month = String(birthdate.getMonth() + 1).padStart(2, '0');
    const day = String(birthdate.getDate()).padStart(2, '0');
    const hours = String(birthdate.getHours()).padStart(2, '0');
    const minutes = String(birthdate.getMinutes()).padStart(2, '0');
    
    birthdateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  themeSelect.value = settings.theme || 'midnight';
  colorSchemeSelect.value = settings.colorScheme || 'blue';
  fontSelect.value = settings.font || 'montserrat';
  layoutSelect.value = settings.layout || 'minimal';
  showMillisecondsToggle.checked = settings.showMilliseconds !== false;
  showLabelsToggle.checked = settings.showLabels !== false;
  animationSpeedSelect.value = settings.animationSpeed || 'normal';
  
  // Apply theme to preview
  updatePreview();
}

// Update the preview with current settings
function updatePreview() {
  const theme = themeSelect.value;
  const colorScheme = colorSchemeSelect.value;
  const font = fontSelect.value;
  
  // Apply theme to the preview
  const themeData = THEMES[theme] || THEMES.midnight;
  const colorSchemeData = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.blue;
  const fontData = FONTS[font] || FONTS.montserrat;
  
  // Add font link if not already present
  if (!document.querySelector(`link[href="${fontData.url}"]`)) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = fontData.url;
    document.head.appendChild(fontLink);
  }
  
  // Apply to preview container
  previewContainer.style.background = themeData.background;
  
  // Apply to preview elements
  const previewValues = document.querySelectorAll('.preview-value');
  previewValues.forEach(el => {
    el.style.color = colorSchemeData.primary;
    el.style.fontFamily = fontData.family;
  });
  
  const previewLabels = document.querySelectorAll('.preview-label');
  previewLabels.forEach(el => {
    el.style.color = themeData.textColor;
    el.style.opacity = '0.7';
    el.style.fontFamily = fontData.family;
  });
  
  // Update layout preview
  const layout = layoutSelect.value;
  const showLabels = showLabelsToggle.checked;
  
  if (!showLabels) {
    previewLabels.forEach(el => {
      el.style.display = 'none';
    });
  } else {
    previewLabels.forEach(el => {
      el.style.display = 'block';
    });
  }
  
  // Apply layout styles
  const previewSections = document.querySelectorAll('.preview-section');
  
  previewSections.forEach(section => {
    section.className = 'preview-section';
    
    if (layout === 'detailed') {
      section.style.padding = '8px';
      section.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
      section.style.borderRadius = '8px';
    } else if (layout === 'compact') {
      section.style.padding = '4px';
      section.style.minWidth = '60px';
    } else if (layout === 'creative') {
      section.style.position = 'relative';
      section.style.transition = 'transform 0.3s ease';
      
      const value = section.querySelector('.preview-value');
      if (value) {
        value.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        value.style.padding = '4px 8px';
        value.style.borderRadius = '8px';
        value.style.borderBottom = `3px solid ${colorSchemeData.primary}`;
      }
    }
  });
}

// Save settings
async function saveSettings() {
  // Get current settings
  const settings = await getSettings();
  
  // Update with form values
  if (birthdateInput.value) {
    settings.birthday = new Date(birthdateInput.value).toISOString();
  }
  
  settings.theme = themeSelect.value;
  settings.colorScheme = colorSchemeSelect.value;
  settings.font = fontSelect.value;
  settings.layout = layoutSelect.value;
  settings.showMilliseconds = showMillisecondsToggle.checked;
  settings.showLabels = showLabelsToggle.checked;
  settings.animationSpeed = animationSpeedSelect.value;
  
  // Save to storage
  await Storage.set('settings', settings);
  
  // Show success message
  showMessage('Settings saved successfully!');
}

// Reset settings to defaults
async function resetToDefaults() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    await Storage.set('settings', DEFAULT_SETTINGS);
    
    // Reload the page to reflect defaults
    location.reload();
  }
}

// Show a message to the user
function showMessage(message, isError = false) {
  // Check if a message already exists and remove it
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `message ${isError ? 'message-error' : 'message-success'}`;
  messageElement.textContent = message;
  
  // Add to the document
  document.body.appendChild(messageElement);
  
  // Animate in
  setTimeout(() => {
    messageElement.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    messageElement.classList.remove('show');
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, 3000);
}

// Event Listeners
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveSettings();
});

resetButton.addEventListener('click', resetToDefaults);

// Update preview when settings change
themeSelect.addEventListener('change', updatePreview);
colorSchemeSelect.addEventListener('change', updatePreview);
fontSelect.addEventListener('change', updatePreview);
layoutSelect.addEventListener('change', updatePreview);
showLabelsToggle.addEventListener('change', updatePreview);

// Initialize the page
document.addEventListener('DOMContentLoaded', initOptions);