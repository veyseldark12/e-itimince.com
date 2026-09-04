// src/views/TUMARankingsView.jsx

import { useState, useMemo } from 'react';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';

export function TUMARankingsView() {
  const theme = APP_THEME;
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');

  // TÜMA'sı olan üniversiteler
  const universitiesWithTUMA = useMemo(() => {
    return Object.values(uniDatabase)
      .filter(uni => uni.tuma?.genel)
      .sort((a, b) => a.tuma.genel - b.tuma.genel);
  }, []);

  // Tüm fakülte tiplerini topla
  const allFaculties = useMemo(() => {
    const faculties = new Set();
    Object.values(uniDatabase).forEach(uni => {
      if (uni.tuma) {
        Object.keys(uni.tuma).forEach(key => {
          if (key !== 'genel') faculties.add(key);
        });
      }
    });
    return Array.from(faculties).sort();
  }, []);

  // Filtrelenmiş ve sıralanmış üniversiteler
  const filteredUniversities = useMemo(() => {
    let list = universitiesWithTUMA;

    // Fakülte filtresi
    if (selectedFaculty !== 'ALL') {
      list = list.filter(uni => uni.tuma?.[selectedFaculty]);
    }

    // Arama filtresi
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(uni => 
        uni.name.toLowerCase().includes(term) ||
        uni.key.toLowerCase().includes(term)
      );
    }

    // Sıralama
    if (sortBy === 'rank') {
      if (selectedFaculty !== 'ALL') {
        list = list.sort((a, b) => {
          const aRank = a.tuma?.[selectedFaculty];
          const bRank = b.tuma?.[selectedFaculty];
          if (aRank === undefined) return 1;
          if (bRank === undefined) return -1;
          return aRank - bRank;
        });
      } else {
        list = list.sort((a, b) => a.tuma.genel - b.tuma.genel);
      }
    } else {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [universitiesWithTUMA, selectedFaculty, searchTerm, sortBy]);

  // Fakültede sıralaması olan üniversite sayısı
  const facultyCount = useMemo(() => {
    if (selectedFaculty === 'ALL') return universitiesWithTUMA.length;
    return universitiesWithTUMA.filter(uni => uni.tuma?.[selectedFaculty]).length;
  }, [universitiesWithTUMA, selectedFaculty]);

  // Renk belirle
  const getTUMAColor = (rank) => {
    if (rank === undefined || rank === null) return theme.textSecondary;
    if (rank <= 10) return '#10b981';
    if (rank <= 30) return '#3b82f6';
    if (rank <= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getTUMALabel = (rank) => {
    if (rank === undefined || rank === null) return '❌ Veri Yok';
    if (rank <= 10) return '🏅 En İyi 10';
    if (rank <= 30) return '⭐ İlk 30';
    if (rank <= 50) return '📈 İlk 50';
    return '📊 Memnuniyet';
  };

  return (
    <div>
      <h2 style={{ color: theme.textPrimary, fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
        🏆 TÜMA Memnuniyet Sıralamaları
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: '16px', marginBottom: '32px' }}>
        Türkiye Üniversite Memnuniyet Araştırması (TÜMA) - Öğrenci memnuniyetine göre sıralama.
      </p>

      {/* Filtreler */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        background: theme.cardBg,
        padding: '20px 24px',
        borderRadius: '16px',
        border: theme.cardBorder,
        alignItems: 'center',
      }}>
        {/* Fakülte Seçimi */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '4px' }}>
            🏫 Fakülte / Alan Seç
          </label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">📊 Genel Memnuniyet</option>
            {allFaculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
        </div>

        {/* Arama */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '4px' }}>
            🔍 Üniversite Ara
          </label>
          <input
            type="text"
            placeholder="Üniversite adı..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Sıralama */}
        <div style={{ minWidth: '150px' }}>
          <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '4px' }}>
            🔄 Sıralama
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="rank">📈 TÜMA'ya Göre</option>
            <option value="name">🔤 Alfabetik</option>
          </select>
        </div>

        {/* Sonuç sayısı */}
        <div style={{ 
          padding: '10px 16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          textAlign: 'center',
          minWidth: '100px',
        }}>
          <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Sonuç</div>
          <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '700' }}>
            {filteredUniversities.length}
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '16px',
        overflow: 'hidden',
        border: theme.cardBorder,
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: theme.textSecondary, width: '50px' }}>
                  #
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: theme.textSecondary }}>
                  🏛️ Üniversite
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary, width: '120px' }}>
                  {selectedFaculty === 'ALL' ? '🏆 Genel TÜMA' : `🏫 ${selectedFaculty}`}
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary, width: '120px' }}>
                  🏆 Genel TÜMA
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary, width: '100px' }}>
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((uni, index) => {
                  const facultyRank = selectedFaculty !== 'ALL' 
                    ? uni.tuma?.[selectedFaculty] 
                    : uni.tuma?.genel;
                  const hasFacultyRank = facultyRank !== undefined && facultyRank !== null;

                  return (
                    <tr
                      key={uni.key}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                    >
                      <td style={{ padding: '14px 20px', color: theme.textSecondary }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '24px' }}>{uni.icon}</span>
                          <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                            {uni.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        textAlign: 'center',
                        fontWeight: '700',
                        color: hasFacultyRank ? getTUMAColor(facultyRank) : theme.textSecondary,
                      }}>
                        {hasFacultyRank ? `#${facultyRank}` : '-'}
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        textAlign: 'center',
                        color: uni.tuma?.genel ? getTUMAColor(uni.tuma.genel) : theme.textSecondary,
                        fontWeight: uni.tuma?.genel ? '600' : '400',
                      }}>
                        {uni.tuma?.genel ? `#${uni.tuma.genel}` : '-'}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {hasFacultyRank ? (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getTUMAColor(facultyRank) + '20',
                            color: getTUMAColor(facultyRank),
                          }}>
                            {getTUMALabel(facultyRank)}
                          </span>
                        ) : (
                          <span style={{ color: theme.textSecondary, fontSize: '12px' }}>❌ Veri Yok</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.textSecondary }}>
                    😕 Bu kritere uygun üniversite bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dipnot */}
      <div style={{
        marginTop: '16px',
        padding: '12px 20px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        color: theme.textSecondary,
        fontSize: '13px',
      }}>
        💡 <strong>İpucu:</strong> Bir fakülte/alan seçerek o alandaki memnuniyet sıralamasını görebilir, üniversite arayarak filtreleyebilirsiniz.
        {selectedFaculty !== 'ALL' && (
          <span> • <strong>{facultyCount}</strong> üniversite bu alanda sıralamaya sahip.</span>
        )}
      </div>
    </div>
  );
}