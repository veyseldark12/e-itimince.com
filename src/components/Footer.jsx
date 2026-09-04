// src/components/Footer.jsx

import { APP_THEME } from '../constants/theme';

export function Footer() {
  const theme = APP_THEME;

  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '32px 24px',
        color: theme.textSecondary,
        fontSize: '14px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: theme.cardBg,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <span>© 2026 egitimince.com</span>
          <span>|</span>
          <span>Tüm veriler 2025 YKS yerleştirme sonuçlarına göre optimize edilmiştir.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{ color: theme.accentMain, textDecoration: 'none', fontWeight: '600' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Kullanım Koşulları
          </a>
          <span style={{ color: theme.textSecondary }}>•</span>
          <a
            href="#"
            style={{ color: theme.accentMain, textDecoration: 'none', fontWeight: '600' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Gizlilik Politikası
          </a>
          <span style={{ color: theme.textSecondary }}>•</span>
          <a
            href="#"
            style={{ color: theme.accentMain, textDecoration: 'none', fontWeight: '600' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            İletişim
          </a>
        </div>
      </div>
    </footer>
  );
}