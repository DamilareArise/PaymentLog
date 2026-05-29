export const C = {
  primary: '#583820',
  dark: '#3D2714',
  vdark: '#2D1B10',
  gold: '#D4A853',
  light: '#FDF6EC',
  bg: '#F5F0EB',
  white: '#FFFFFF',
  text: '#2D1B10',
  muted: '#8B5E3C',
  border: 'rgba(88,56,32,0.15)',
};

export const CLASSES = {
  Nursery: ['Creche', 'Nursery 1', 'Nursery 2', 'Nursery 3'],
  Primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  Secondary: ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'],
};

export const ALL_CLASSES = [...CLASSES.Nursery, ...CLASSES.Primary, ...CLASSES.Secondary];

export const SCHOOL_TYPES = ['Nursery', 'Primary', 'Secondary'];

export const STATUS_COLORS = {
  admitted: { bg: 'rgba(22,163,74,0.1)', color: '#15803D', label: 'Admitted' },
  pending: { bg: 'rgba(217,119,6,0.1)', color: '#B45309', label: 'Pending' },
  not_admitted: { bg: 'rgba(220,38,38,0.1)', color: '#DC2626', label: 'Not Admitted' },
};
