// src/components/NavButton.jsx

import { APP_THEME } from '../constants/theme';

export function NavButton({ active, onClick, children }) {
  const theme = APP_THEME;

  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
        border: active ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
        color: active ? theme.accentMain : theme.textPrimary,
        fontWeight: active ? '700' : '500',
        cursor: 'pointer',
        fontSize: '15px',
        padding: '10px 20px',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
}