// src/views/FavoritesView.jsx

import { APP_THEME } from '../constants/theme';

export function FavoritesView({ favorites, allDepartments, toggleFavorite }) {
  const theme = APP_THEME;
  const favoriteDepts = allDepartments.filter((d) => favorites.includes(d.id));

  return (
    <div>
      <h2 style={{ color: theme.accentMain, fontSize: '28px', marginBottom: '10px' }}>
        ⭐ Tercih Listem
      </h2>
      <p style={{ color: theme.textSecondary, marginBottom: '30px' }}>
        Yıldızladığınız favori bölümleriniz burada listelenir.
      </p>

      {favorites.length === 0 ? (
        <div
          style={{
            background: theme.cardBg,
            padding: '60px',
            textAlign: 'center',
            borderRadius: '24px',
            border: theme.cardBorder,
          }}
        >
          <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
            Tercih listeniz henüz boş. Üniversite bölümlerinin yanındaki yıldız ikonuna tıklayarak favorilerinize ekleyin.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {favoriteDepts.map((dept) => (
            <div
              key={dept.id}
              style={{
                background: theme.cardBg,
                borderRadius: '20px',
                padding: '24px',
                border: theme.cardBorder,
                position: 'relative',
              }}
            >
              <button
                onClick={() => toggleFavorite(dept.id)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ⭐
              </button>
              <div style={{ color: theme.accentMain, fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                {dept.uniName}
              </div>
              <h3 style={{ color: theme.textPrimary, fontSize: '18px', marginBottom: '8px' }}>
                {dept.name}
              </h3>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: theme.accentCyan, marginBottom: '12px' }}>
                <span>{dept.type}</span> • <span>Sıra: {dept.rank2025}</span> • <span>Kont: {dept.quota}</span>
              </div>
              <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}