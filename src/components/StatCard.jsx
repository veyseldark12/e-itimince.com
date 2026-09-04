// src/components/StatCard.jsx

import { APP_THEME } from '../constants/theme';

export function StatCard({ title, value, icon, color }) {
  const theme = APP_THEME;
  const cardColor = color || theme.accentCyan;

  return (
    <div
      style={{
        background: theme.cardBg,
        backdropFilter: 'blur(12px)',
        padding: '32px',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        border: theme.cardBorder,
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(0,0,0,0.5), 0 0 40px ${cardColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
    >
      <div
        style={{
          fontSize: '48px',
          background: `rgba(255, 255, 255, 0.05)`,
          border: `2px solid ${cardColor}`,
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          boxShadow: `0 0 30px ${cardColor}20`,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            color: theme.textSecondary,
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          {title}
        </div>
        <div style={{ color: theme.textPrimary, fontSize: '40px', fontWeight: '900', marginTop: '4px' }}>
          {value}
        </div>
      </div>
    </div>
  );
}