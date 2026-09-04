// src/constants/theme.js

export const COLORS = {
  primary: '#1a1a1a',
  secondary: '#cbd5e1', // Okunabilirliği artırmak için daha açık gri
  accent: '#f97316',
  accentLight: '#fb923c',
  accentLighter: '#fed7aa',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  light: '#ffffff',
  dark: '#1a1a1a',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const FONTS = {
  heading: "'Inter', 'Poppins', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

export const TRANSITIONS = {
  default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
};

export const APP_THEME = {
  bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #ffedd5 100%)',
  navBg: 'rgba(255, 255, 255, 0.85)',
  cardBg: '#ffffff',
  cardBorder: '1px solid rgba(0, 0, 0, 0.06)',
  textPrimary: '#0f172a', // Yazıların arka planda kaybolmaması için en koyu/net ton
  textSecondary: '#475569', // İkincil yazılar için optimize edilmiş okunabilir ton
  accentMain: '#f97316',
  accentHover: '#ea580c',
  accentCyan: '#0ea5e9',
  danger: '#dc2626', // Hata metinlerinin net okunması için koyulaştırıldı
  success: '#16a34a', // Başarı metinlerinin net okunması için koyulaştırıldı
};

export default {
  COLORS,
  FONTS,
  BREAKPOINTS,
  SHADOWS,
  TRANSITIONS,
  APP_THEME,
};