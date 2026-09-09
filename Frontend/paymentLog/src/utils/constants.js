export const C = {
  // Core brand
  primary: '#000f22',              // deep navy
  secondary: '#775a19',            // amber/gold
  // Surfaces
  bg: '#f8f9ff',                   // page background
  surface: '#ffffff',              // white card
  surfaceLow: '#eff4ff',           // subtle blue tint
  surfaceContainer: '#e5eeff',     // container
  surfaceHigh: '#dce9ff',          // high-emphasis container
  // Text
  text: '#0b1c30',                 // primary text
  muted: '#43474d',                // secondary text
  // Borders
  border: '#c4c6ce',               // standard border
  // Semantic
  white: '#ffffff',
  secondaryContainer: '#fed488',   // gold highlight bg
  primaryFixed: '#d2e4ff',         // light blue accent bg
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  // Aliases kept for legacy inner-page code
  dark: '#000f22',
  vdark: '#000f22',
  gold: '#775a19',
  light: '#f8f9ff',
};

export const CLASSES = {
  KG: ['Creche', 'Pre-KG', 'KG 1', 'KG 2'],
  Nursery: ['Nursery 1', 'Nursery 2', 'Nursery 3'],
  Primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  Secondary: ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'],
};

export const ALL_CLASSES = [...CLASSES.KG, ...CLASSES.Nursery, ...CLASSES.Primary, ...CLASSES.Secondary];

export const SCHOOL_TYPES = ['KG', 'Nursery', 'Primary', 'Secondary'];

export const STATUS_COLORS = {
  admitted: { bg: 'rgba(22,163,74,0.1)', color: '#15803D', label: 'Admitted' },
  pending: { bg: 'rgba(119,90,25,0.1)', color: '#775a19', label: 'Pending' },
  not_admitted: { bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a', label: 'Not Admitted' },
};
