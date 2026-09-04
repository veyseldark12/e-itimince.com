// src/views/QSRankingsView.jsx

import { useState, useMemo } from 'react';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';

export function QSRankingsView() {
  const theme = APP_THEME;
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank'); // rank veya name

  // Tüm üniversiteleri QS'ye göre sırala (QS'si olanlar)
  const universitiesWithQS = useMemo(() => {
    return Object.values(uniDatabase)
      .filter(uni => uni.qs)
      .sort((a, b) => a.qs - b.qs);
  }, []);

  // Tüm subject'leri topla
  const allSubjects = useMemo(() => {
    const subjects = new Set();
    Object.values(uniDatabase).forEach(uni => {
      if (uni.qsDetails) {
        Object.keys(uni.qsDetails).forEach(subject => subjects.add(subject));
      }
    });
    return Array.from(subjects).sort();
  }, []);

  // Filtrelenmiş ve sıralanmış üniversiteler
  const filteredUniversities = useMemo(() => {
    let list = universitiesWithQS;

    // Subject filtresi
    if (selectedSubject !== 'ALL') {
      list = list.filter(uni => uni.qsDetails?.[selectedSubject]);
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
      if (selectedSubject !== 'ALL') {
        list = list.sort((a, b) => {
          const aRank = a.qsDetails?.[selectedSubject];
          const bRank = b.qsDetails?.[selectedSubject];
          if (aRank === undefined) return 1;
          if (bRank === undefined) return -1;
          if (typeof aRank === 'string') return parseInt(aRank) - parseInt(bRank);
          return aRank - bRank;
        });
      } else {
        list = list.sort((a, b) => a.qs - b.qs);
      }
    } else {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [universitiesWithQS, selectedSubject, searchTerm, sortBy]);

  // Subject'te sıralaması olan üniversite sayısı
  const subjectCount = useMemo(() => {
    if (selectedSubject === 'ALL') return universitiesWithQS.length;
    return universitiesWithQS.filter(uni => uni.qsDetails?.[selectedSubject]).length;
  }, [universitiesWithQS, selectedSubject]);

  // QS değerini formatla
  const formatQSRank = (rank) => {
    if (rank === undefined || rank === null) return '-';
    if (typeof rank === 'string') return rank;
    return `#${rank}`;
  };

  // Renk belirle
  const getQSRankColor = (rank) => {
    if (rank === undefined || rank === null) return theme.textSecondary;
    const num = typeof rank === 'string' ? parseInt(rank) : rank;
    if (num <= 100) return '#10b981';
    if (num <= 300) return '#3b82f6';
    if (num <= 500) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      <h2 style={{ color: theme.textPrimary, fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
        🌍 QS Dünya Üniversite Sıralamaları
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: '16px', marginBottom: '32px' }}>
        Türkiye'deki üniversitelerin QS Dünya Sıralamaları ve alan bazlı performansları.
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
        {/* Subject Seçimi */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ color: theme.textSecondary, fontSize: '12px', display: 'block', marginBottom: '4px' }}>
            📚 Alan Seç
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
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
            <option value="ALL">📊 Tüm Alanlar (Genel Sıralama)</option>
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
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
            <option value="rank">📈 QS'ye Göre</option>
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
                  {selectedSubject === 'ALL' ? '🌍 QS Genel' : `📚 ${selectedSubject}`}
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary, width: '120px' }}>
                  🌍 QS Genel
                </th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary, width: '100px' }}>
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((uni, index) => {
                  const subjectRank = selectedSubject !== 'ALL' 
                    ? uni.qsDetails?.[selectedSubject] 
                    : uni.qs;
                  const hasSubjectRank = subjectRank !== undefined && subjectRank !== null;

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
                        color: hasSubjectRank ? getQSRankColor(subjectRank) : theme.textSecondary,
                      }}>
                        {hasSubjectRank ? formatQSRank(subjectRank) : '-'}
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        textAlign: 'center',
                        color: uni.qs ? getQSRankColor(uni.qs) : theme.textSecondary,
                        fontWeight: uni.qs ? '600' : '400',
                      }}>
                        {uni.qs ? `#${uni.qs}` : '-'}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {hasSubjectRank ? (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getQSRankColor(subjectRank) + '20',
                            color: getQSRankColor(subjectRank),
                          }}>
                            {(() => {
                              const num = typeof subjectRank === 'string' ? parseInt(subjectRank) : subjectRank;
                              if (num <= 100) return '🏅 Dünya 100';
                              if (num <= 300) return '⭐ İlk 300';
                              if (num <= 500) return '📈 İlk 500';
                              return '🌍 Dünya';
                            })()}
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
        💡 <strong>İpucu:</strong> Bir alan seçerek o alandaki sıralamayı görebilir, üniversite arayarak filtreleyebilirsiniz.
        {selectedSubject !== 'ALL' && (
          <span> • <strong>{subjectCount}</strong> üniversite bu alanda sıralamaya sahip.</span>
        )}
      </div>
    </div>
  );
}