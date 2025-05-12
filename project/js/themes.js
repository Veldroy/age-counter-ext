/**
 * Theme definitions for the Age Counter extension
 */
const THEMES = {
  midnight: {
    name: 'Midnight',
    background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
    textColor: '#ffffff',
    accentColor: '#2196f3',
    secondaryColor: '#424242',
    fontOptions: ['montserrat', 'roboto', 'open-sans', 'poppins', 'inter'],
    animationOptions: ['particles', 'gradient', 'none'],
  },
  aurora: {
    name: 'Aurora',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    textColor: '#e0e0ff',
    accentColor: '#7f5af0',
    secondaryColor: '#2cb67d',
    fontOptions: ['montserrat', 'roboto', 'open-sans', 'poppins', 'inter'],
    animationOptions: ['particles', 'gradient', 'none'],
  },
  galaxy: {
    name: 'Galaxy',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #161616 100%)',
    textColor: '#ffffff',
    accentColor: '#ff6b6b',
    secondaryColor: '#4ecdc4',
    fontOptions: ['montserrat', 'roboto', 'open-sans', 'poppins', 'inter'],
    animationOptions: ['particles', 'gradient', 'none'],
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%)',
    textColor: '#e0f7fa',
    accentColor: '#81d4fa',
    secondaryColor: '#4dd0e1',
    fontOptions: ['montserrat', 'roboto', 'open-sans', 'poppins', 'inter'],
    animationOptions: ['particles', 'gradient', 'none'],
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #1a2a32 100%)',
    textColor: '#d0f0c0',
    accentColor: '#2ecc71',
    secondaryColor: '#34495e',
    fontOptions: ['montserrat', 'roboto', 'open-sans', 'poppins', 'inter'],
    animationOptions: ['particles', 'gradient', 'none'],
  }
};

/**
 * Color schemes available in the extension
 */
const COLOR_SCHEMES = {
  blue: {
    primary: '#2196f3',
    secondary: '#64b5f6',
    accent: '#1565c0',
  },
  purple: {
    primary: '#7f5af0',
    secondary: '#a580ff',
    accent: '#4c2bc2',
  },
  green: {
    primary: '#2ecc71',
    secondary: '#51d88a',
    accent: '#25a25a',
  },
  orange: {
    primary: '#ff9800',
    secondary: '#ffb74d',
    accent: '#f57c00',
  },
  red: {
    primary: '#f44336',
    secondary: '#e57373',
    accent: '#d32f2f',
  },
  teal: {
    primary: '#009688',
    secondary: '#4db6ac',
    accent: '#00796b',
  },
};

/**
 * Font definitions
 */
const FONTS = {
  montserrat: {
    name: 'Montserrat',
    family: '"Montserrat", sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
  },
  roboto: {
    name: 'Roboto',
    family: '"Roboto", sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  },
  'open-sans': {
    name: 'Open Sans',
    family: '"Open Sans", sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
  },
  poppins: {
    name: 'Poppins',
    family: '"Poppins", sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
  },
  inter: {
    name: 'Inter',
    family: '"Inter", sans-serif',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  },
};

/**
 * Layout options for the counter display
 */
const LAYOUTS = {
  minimal: {
    name: 'Minimal',
    showLabels: false,
    showMilliseconds: true,
    animate: true,
  },
  detailed: {
    name: 'Detailed',
    showLabels: true,
    showMilliseconds: true,
    animate: true,
  },
  compact: {
    name: 'Compact',
    showLabels: true,
    showMilliseconds: false,
    animate: false,
  },
  creative: {
    name: 'Creative',
    showLabels: true,
    showMilliseconds: true,
    animate: true,
  },
};

/**
 * Apply theme to the document
 */
function applyTheme(themeName, colorSchemeName, fontName) {
  const theme = THEMES[themeName] || THEMES.midnight;
  const colorScheme = COLOR_SCHEMES[colorSchemeName] || COLOR_SCHEMES.blue;
  const font = FONTS[fontName] || FONTS.montserrat;
  
  // Add font link if not already present
  if (!document.querySelector(`link[href="${font.url}"]`)) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = font.url;
    document.head.appendChild(fontLink);
  }
  
  // Apply CSS variables
  document.documentElement.style.setProperty('--background', theme.background);
  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--accent-color', colorScheme.primary);
  document.documentElement.style.setProperty('--secondary-color', colorScheme.secondary);
  document.documentElement.style.setProperty('--accent-dark', colorScheme.accent);
  document.documentElement.style.setProperty('--font-family', font.family);
}

/**
 * Apply layout to the counter
 */
function applyLayout(layoutName, counterElement) {
  const layout = LAYOUTS[layoutName] || LAYOUTS.minimal;
  
  if (counterElement) {
    counterElement.classList.remove('layout-minimal', 'layout-detailed', 'layout-compact', 'layout-creative');
    counterElement.classList.add(`layout-${layoutName}`);
    
    counterElement.dataset.showLabels = layout.showLabels;
    counterElement.dataset.showMilliseconds = layout.showMilliseconds;
    counterElement.dataset.animate = layout.animate;
  }
}