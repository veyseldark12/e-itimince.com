// src/views/EmploymentAnalysisView.jsx

import { useState, useMemo } from 'react';
import { APP_THEME } from '../constants/theme';
import { getEmploymentData } from '../utils/employmentMatcher';
import { bachelorEmploymentData, associateEmploymentData } from '../data/employmentData';

export function EmploymentAnalysisView({ allDepartments }) {
  const theme = APP_THEME;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, LISANS, ONLISANS
  const [sortBy, setSortBy] = useState('rate'); // rate, name

  // Tüm bölümlerin istihdam verilerini hesapla
  const employmentStats = useMemo(() => {
    const stats = [];
    
    // Lisans verileri
    Object.entries(bachelorEmploymentData).forEach(([name, data]) => {
      if (data.rate2025 !== null && data.rate2025 !== undefined) {
        stats.push({
          name,
          rate: data.rate2025,
          type: 'Lisans',
          year: 2025,
        });
      }
    });
    
    // Ön Lisans verileri
    Object.entries(associateEmploymentData).forEach(([name, data]) => {
      if (data.rate2025 !== null && data.rate2025 !== undefined) {
        stats.push({
          name,
          rate: data.rate2025,
          type: 'Ön Lisans',
          year: 2025,
        });
      }
    });
    
    return stats;
  }, []);

  // Filtreleme ve sıralama
  const filteredStats = useMemo(() => {
    let filtered = [...employmentStats];
    
    // Arama
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term)
      );
    }
    
    // Tür filtresi
    if (filterType !== 'ALL') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    // Sıralama
    if (sortBy === 'rate') {
      filtered.sort((a, b) => b.rate - a.rate);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  }, [employmentStats, searchTerm, filterType, sortBy]);

  // İstatistikler
  const totalDepts = employmentStats.length;
  const avgRate = (employmentStats.reduce((sum, d) => sum + d.rate, 0) / totalDepts).toFixed(1);
  const highestRate = employmentStats.sort((a, b) => b.rate - a.rate)[0];
  const lowestRate = employmentStats.sort((a, b) => a.rate - b.rate)[0];

  const getRateColor = (rate) => {
    if (rate >= 80) return '#10b981';
    if (rate >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getRateLabel = (rate) => {
    if (rate >= 80) return '✅ Yüksek';
    if (rate >= 60) return '📈 Orta';
    return '⚠️ Düşük';
  };

  return (
    <div>
      <h2 style={{ color: theme.textPrimary, fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
        💼 Bölüm İstihdam Analizi
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: '16px', marginBottom: '32px' }}>
        TÜİK Yükseköğretim İstihdam Göstergeleri (2025) - Bölüm bazlı istihdam oranları.
      </p>

      {/* Özet Kartları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: theme.cardBg,
          padding: '16px',
          borderRadius: '16px',
          textAlign: 'center',
          border: theme.cardBorder,
        }}>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>Toplam Bölüm</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: theme.textPrimary }}>{totalDepts}</div>
        </div>
        <div style={{
          background: theme.cardBg,
          padding: '16px',
          borderRadius: '16px',
          textAlign: 'center',
          border: theme.cardBorder,
        }}>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>Ortalama İstihdam</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>%{avgRate}</div>
        </div>
        <div style={{
          background: theme.cardBg,
          padding: '16px',
          borderRadius: '16px',
          textAlign: 'center',
          border: theme.cardBorder,
        }}>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>En Yüksek</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
            {highestRate?.name?.slice(0, 20)}...
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>%{highestRate?.rate?.toFixed(1)}</div>
        </div>
        <div style={{
          background: theme.cardBg,
          padding: '16px',
          borderRadius: '16px',
          textAlign: 'center',
          border: theme.cardBorder,
        }}>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>En Düşük</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>
            {lowestRate?.name?.slice(0, 20)}...
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>%{lowestRate?.rate?.toFixed(1)}</div>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '24px',
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Bölüm ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '14px',
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            border: '2px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: theme.textPrimary,
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">📊 Tümü</option>
          <option value="Lisans">🎓 Lisans</option>
          <option value="Ön Lisans">📘 Ön Lisans</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            border: '2px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: theme.textPrimary,
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="rate">📈 İstihdama Göre</option>
          <option value="name">🔤 Alfabetik</option>
        </select>
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
                <th style={{ padding: '14px 20px', textAlign: 'left', color: theme.textSecondary }}>#</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: theme.textSecondary }}>Bölüm</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: theme.textSecondary }}>Tür</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', color: theme.textSecondary }}>İstihdam Oranı</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', color: theme.textSecondary }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((item, index) => (
                <tr
                  key={item.name}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <td style={{ padding: '12px 20px', color: theme.textSecondary }}>{index + 1}</td>
                  <td style={{ padding: '12px 20px', color: theme.textPrimary, fontWeight: '500' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      padding: '2px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: item.type === 'Lisans' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: item.type === 'Lisans' ? '#3b82f6' : '#10b981',
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{
                    padding: '12px 20px',
                    textAlign: 'right',
                    fontWeight: '700',
                    color: getRateColor(item.rate),
                  }}>
                    %{item.rate.toFixed(1)}
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getRateColor(item.rate) + '20',
                      color: getRateColor(item.rate),
                    }}>
                      {getRateLabel(item.rate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}