// src/views/SimulationView.jsx

import { useState } from 'react';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';
import { getSubjectRank, getTumaRank } from '../utils/rankHelpers';
import { getEmploymentData } from '../utils/employmentMatcher';
import * as XLSX from 'xlsx';

// 1. Türkçe karakterleri %100 güvenli küçülten filtre
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ş/g, 'ş')
    .replace(/Ç/g, 'ç')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ö/g, 'ö')
    .toLowerCase()
    .trim();
};

export function SimulationView({
  minRank,
  setMinRank,
  maxRank,
  setMaxRank,
  minScore,
  setMinScore,
  maxScore,
  setMaxScore,
  simFilterType,
  setSimFilterType,
  allDepartments,
  compareList,
  toggleCompare,
}) {
  const theme = APP_THEME;

  // Hangi arama türünün seçili olduğunu tutuyoruz ('rank' veya 'score')
  const [searchMode, setSearchMode] = useState(() => {
    return (minScore !== '' && minScore !== undefined) || (maxScore !== '' && maxScore !== undefined) ? 'score' : 'rank';
  });

  // Şehir filtresi
  const [selectedCity, setSelectedCity] = useState('ALL');
  // Üniversite tipi filtresi (Vakıf/Devlet)
  const [selectedUniType, setSelectedUniType] = useState('ALL');
  // Arama terimi
  const [searchTerm, setSearchTerm] = useState('');

  // Tüm şehirleri topla
  const allCities = [...new Set(Object.values(uniDatabase).map(u => u.city?.split('(')[0]?.trim() || 'Bilinmiyor'))].sort();

  const filtered = allDepartments
    .filter((d) => {
      // Üniversite bilgilerini al
      const uni = Object.values(uniDatabase).find((u) => u.key === d.uniKey);
      
      // Şehir filtresi
      if (selectedCity !== 'ALL') {
        const city = uni?.city?.split('(')[0]?.trim() || '';
        if (!city.includes(selectedCity)) return false;
      }

      // Üniversite tipi filtresi
      if (selectedUniType !== 'ALL') {
        if (uni?.type !== selectedUniType) return false;
      }

      // Arama filtresi (bölüm adı veya üniversite adı)
      if (searchTerm) {
        const term = normalizeText(searchTerm);
        const deptName = normalizeText(d.name);
        const uniName = normalizeText(d.uniName || '');
        if (!deptName.includes(term) && !uniName.includes(term)) return false;
      }

      // Sıralama veya puan filtresi
      if (searchMode === 'rank') {
        const hasRank = (minRank !== '' && minRank !== undefined && !isNaN(minRank)) || (maxRank !== '' && maxRank !== undefined && !isNaN(maxRank));
        if (!hasRank) return true;

        const rank = Number(d.rank2025);
        if (isNaN(rank) || d.rank2025 === '-') return false;
        const minR = minRank !== '' && minRank !== undefined ? Number(minRank) : 1;
        const maxR = maxRank !== '' && maxRank !== undefined ? Number(maxRank) : Infinity;
        if (rank < minR || rank > maxR) return false;
      } else {
        const hasScore = (minScore !== '' && minScore !== undefined) || (maxScore !== '' && maxScore !== undefined);
        if (!hasScore) return true;

        const scoreVal = d.score2025 && d.score2025 !== '-' ? parseFloat(String(d.score2025).replace(',', '.')) : NaN;
        if (isNaN(scoreVal)) return false;
        const minS = minScore !== '' && minScore !== undefined ? Number(minScore) : 0;
        const maxS = maxScore !== '' && maxScore !== undefined ? Number(maxScore) : 1000;
        if (scoreVal < minS || scoreVal > maxS) return false;
      }

      return true;
    })
    .filter((d) => simFilterType === 'ALL' || d.type === simFilterType)
    .sort((a, b) => {
      if (searchMode === 'rank') {
        const rankA = Number(a.rank2025);
        const rankB = Number(b.rank2025);
        return (isNaN(rankA) ? Infinity : rankA) - (isNaN(rankB) ? Infinity : rankB);
      } else {
        const scoreA = a.score2025 && a.score2025 !== '-' ? parseFloat(String(a.score2025).replace(',', '.')) : -1;
        const scoreB = b.score2025 && b.score2025 !== '-' ? parseFloat(String(b.score2025).replace(',', '.')) : -1;
        return scoreB - scoreA;
      }
    });

  // Excel Export
  const exportToExcel = () => {
    const excelData = filtered.map((dept, index) => {
      const subjectRank = getSubjectRank(dept.name, dept.uniKey);
      const tumaRank = getTumaRank(dept.name, dept.uniKey);
      const employment = getEmploymentData(dept.name);
      const uni = Object.values(uniDatabase).find((u) => u.key === dept.uniKey);

      return {
        '#': index + 1,
        'Üniversite': dept.uniName || '',
        'Şehir': uni?.city?.split('(')[0]?.trim() || '',
        'Bölüm Adı': dept.name || '',
        'Puan Türü': dept.type || '',
        'Kontenjan': dept.quota || '-',
        'Sıralama (2025)': dept.rank2025 || '-',
        'Puan (2025)': dept.score2025 || '-',
        'QS Subject': subjectRank ? `#${subjectRank}` : '-',
        'TÜMA': tumaRank ? `#${tumaRank}` : '-',
        'İstihdam Oranı': employment?.rate ? `%${employment.rate.toFixed(1)}` : '-',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Simülasyon Sonuçları');
    XLSX.writeFile(workbook, `siralama-simulasyonu-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // İstatistikler
  const totalCount = filtered.length;
  const uniCount = new Set(filtered.map(d => d.uniKey)).size;
  
  // En düşük ve en yüksek sıralama
  const ranks = filtered
    .map(d => Number(d.rank2025))
    .filter(r => !isNaN(r) && r > 0);
  const minRankFound = ranks.length > 0 ? Math.min(...ranks) : null;
  const maxRankFound = ranks.length > 0 ? Math.max(...ranks) : null;

  const getTypeColor = (type) => {
    switch(type) {
      case 'SAY': return { bg: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' };
      case 'EA': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      case 'SÖZ': return { bg: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' };
      case 'DİL': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
      case 'TYT': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
      default: return { bg: 'rgba(255,255,255,0.1)', color: theme.textSecondary };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: theme.accentMain, fontSize: '28px', marginBottom: '4px' }}>
            📈 YKS Simülasyonu
          </h2>
          <p style={{ color: theme.textSecondary, marginBottom: '0' }}>
            Tüm üniversite ve bölümleri sıralama, puan ve kriterlere göre filtreleyin.
          </p>
        </div>

        {/* Excel Export Butonu */}
        {filtered.length > 0 && (
          <button
            onClick={exportToExcel}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
          >
            📥 Excel İndir ({filtered.length} kayıt)
          </button>
        )}
      </div>

      <p style={{ color: theme.textSecondary, marginTop: '8px', marginBottom: '25px' }}>
        Arama yapmak istediğiniz kriter türünü seçin:
      </p>

      {/* Mod Seçim Butonları */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setSearchMode('rank');
            setMinScore('');
            setMaxScore('');
          }}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '16px',
            borderRadius: '16px',
            border: searchMode === 'rank' ? `2px solid ${theme.accentMain}` : '1px solid rgba(255,255,255,0.1)',
            background: searchMode === 'rank' ? 'rgba(245, 158, 11, 0.15)' : theme.cardBg,
            color: theme.textPrimary,
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          🏆 Sıralama ile Ara
        </button>
        <button
          onClick={() => {
            setSearchMode('score');
            setMinRank('');
            setMaxRank('');
          }}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '16px',
            borderRadius: '16px',
            border: searchMode === 'score' ? `2px solid ${theme.accentMain}` : '1px solid rgba(255,255,255,0.1)',
            background: searchMode === 'score' ? 'rgba(245, 158, 11, 0.15)' : theme.cardBg,
            color: theme.textPrimary,
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          ⭐ Puan ile Ara
        </button>
      </div>

      {/* Filtreleme Alanı */}
      <div style={{ 
        background: theme.cardBg, 
        padding: '30px', 
        borderRadius: '24px', 
        border: theme.cardBorder, 
        marginBottom: '30px', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        alignItems: 'flex-end' 
      }}>
        {/* Arama */}
        <div style={{ flex: 2, minWidth: '200px' }}>
          <label style={{ display: 'block', color: theme.textPrimary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>
            🔍 Bölüm / Üniversite Ara
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bölüm veya üniversite adı..."
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '14px',
              border: `2px solid ${theme.accentMain}`,
              fontSize: '16px',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Sıralama veya Puan */}
        {searchMode === 'rank' ? (
          <>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', color: theme.textPrimary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>🏆 Min Sıralama</label>
              <input 
                type="number" 
                value={minRank} 
                onChange={(e) => setMinRank(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="Min" 
                min="1" 
                step="100" 
                style={{ width: '100%', padding: '12px 18px', borderRadius: '14px', border: `2px solid ${theme.accentMain}`, fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', color: theme.textPrimary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>📉 Max Sıralama</label>
              <input 
                type="number" 
                value={maxRank} 
                onChange={(e) => setMaxRank(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="Max" 
                min="1" 
                step="100" 
                style={{ width: '100%', padding: '12px 18px', borderRadius: '14px', border: `2px solid ${theme.accentMain}`, fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} 
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', color: theme.textPrimary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>⭐ Min Puan</label>
              <input 
                type="number" 
                value={minScore} 
                onChange={(e) => setMinScore(e.target.value)} 
                placeholder="Min" 
                step="0.01" 
                style={{ width: '100%', padding: '12px 18px', borderRadius: '14px', border: `2px solid ${theme.accentMain}`, fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', color: theme.textPrimary, fontWeight: '700', marginBottom: '8px', fontSize: '14px' }}>🌟 Max Puan</label>
              <input 
                type="number" 
                value={maxScore} 
                onChange={(e) => setMaxScore(e.target.value)} 
                placeholder="Max" 
                step="0.01" 
                style={{ width: '100%', padding: '12px 18px', borderRadius: '14px', border: `2px solid ${theme.accentMain}`, fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} 
              />
            </div>
          </>
        )}
      </div>

      {/* Ek Filtreler - Şehir ve Üniversite Tipi */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        flexWrap: 'wrap', 
        marginBottom: '24px',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>📍 Şehir</label>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">📍 Tüm Şehirler</option>
            {allCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>🏫 Üniversite Tipi</label>
          <select 
            value={selectedUniType} 
            onChange={(e) => setSelectedUniType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">🏫 Tümü</option>
            <option value="Devlet">🏛️ Devlet</option>
            <option value="Vakıf">🏢 Vakıf</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>📊 Puan Türü</label>
          <select 
            value={simFilterType} 
            onChange={(e) => setSimFilterType(e.target.value)} 
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">📊 Tümü</option>
            <option value="SAY">📐 Sayısal (SAY)</option>
            <option value="EA">⚖️ Eşit Ağırlık (EA)</option>
            <option value="SÖZ">📖 Sözel (SÖZ)</option>
            <option value="DİL">🌍 Dil (DİL)</option>
            <option value="TYT">📝 TYT (2 Yıllık)</option>
          </select>
        </div>
      </div>

      {/* İstatistik Kartları */}
      {filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ background: theme.cardBg, padding: '14px 18px', borderRadius: '12px', border: theme.cardBorder, textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: theme.textSecondary }}>📚 Toplam Bölüm</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>{totalCount}</div>
          </div>
          <div style={{ background: theme.cardBg, padding: '14px 18px', borderRadius: '12px', border: theme.cardBorder, textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: theme.textSecondary }}>🏛️ Üniversite</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>{uniCount}</div>
          </div>
          {minRankFound && (
            <div style={{ background: theme.cardBg, padding: '14px 18px', borderRadius: '12px', border: theme.cardBorder, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: theme.textSecondary }}>🏆 En İyi Sıralama</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>#{minRankFound.toLocaleString('tr-TR')}</div>
            </div>
          )}
          {maxRankFound && (
            <div style={{ background: theme.cardBg, padding: '14px 18px', borderRadius: '12px', border: theme.cardBorder, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: theme.textSecondary }}>📉 En Düşük Sıralama</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#ef4444' }}>#{maxRankFound.toLocaleString('tr-TR')}</div>
            </div>
          )}
        </div>
      )}

      {/* Sonuç Tablosu */}
      {filtered.length > 0 ? (
        <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: theme.cardBg, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '1100px' }}>
            <thead>
              <tr style={{ background: 'rgba(245, 158, 11, 0.15)', borderBottom: '2px solid rgba(245, 158, 11, 0.3)' }}>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.textPrimary, width: '40px' }}>#</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.textPrimary, minWidth: '140px' }}>🏛️ Üniversite</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.textPrimary, minWidth: '180px' }}>📚 Bölüm Adı</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.textPrimary, width: '60px' }}>📊 Tür</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.accentMain, width: '100px' }}>🏆 Sıralama</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#10b981', width: '90px' }}>⭐ Puan</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#0ea5e9', width: '90px' }}>🌍 QS</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#8b5cf6', width: '80px' }}>🏆 TÜMA</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: '#f59e0b', width: '90px' }}>💼 İstihdam</th>
                <th style={{ padding: '14px 16px', fontWeight: '700', color: theme.textPrimary, textAlign: 'center', width: '100px' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept, index) => {
                const rank = dept.rank2025 !== '-' && !isNaN(Number(dept.rank2025)) ? Number(dept.rank2025).toLocaleString('tr-TR') : dept.rank2025;
                const score = dept.score2025 !== '-' && dept.score2025 ? dept.score2025 : '-';
                const uni = Object.values(uniDatabase).find((u) => u.key === dept.uniKey);
                const typeColors = getTypeColor(dept.type);
                const isComp = compareList.some((d) => d.id === dept.id);

                const subjectRank = getSubjectRank(dept.name, dept.uniKey);
                const tumaRank = getTumaRank(dept.name, dept.uniKey);
                const employment = getEmploymentData(dept.name);

                return (
                  <tr key={dept.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '12px 16px', color: theme.textSecondary, fontWeight: '600', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: theme.textPrimary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{uni?.icon || '🏛️'}</span>
                        <span>{dept.uniName}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: theme.textPrimary }}>{dept.name}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: '700', background: typeColors.bg, color: typeColors.color }}>
                        {dept.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: theme.accentMain, textAlign: 'center' }}>{rank}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#10b981', textAlign: 'center' }}>{score}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0ea5e9', textAlign: 'center' }}>
                      {subjectRank ? `#${subjectRank}` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#8b5cf6', textAlign: 'center' }}>
                      {tumaRank ? `#${tumaRank}` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {employment?.rate ? (
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: employment.rate >= 80 ? 'rgba(16, 185, 129, 0.2)' : employment.rate >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: employment.rate >= 80 ? '#10b981' : employment.rate >= 60 ? '#f59e0b' : '#ef4444',
                        }}>
                          %{employment.rate.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleCompare(dept)}
                        style={{ 
                          background: isComp ? theme.accentMain : 'rgba(255,255,255,0.08)', 
                          border: 'none', 
                          borderRadius: '6px', 
                          padding: '5px 12px', 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          color: isComp ? '#fff' : theme.textPrimary, 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isComp ? '✓ Kıyas' : '+ Kıyasla'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: theme.cardBg, padding: '60px', textAlign: 'center', borderRadius: '24px', border: theme.cardBorder }}>
          <p style={{ color: theme.textSecondary, fontSize: '16px' }}>Bu kriterlere uygun bölüm bulunamadı.</p>
        </div>
      )}
    </div>
  );
}