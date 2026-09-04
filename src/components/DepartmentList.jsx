// src/components/DepartmentList.jsx

import { useState } from 'react';
import { uniDatabase } from '../data/uniDatabase';
import { getEmploymentData } from '../utils/employmentMatcher';

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

const getSubjectRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.qsDetails) return null;
  const details = uni.qsDetails;
  const lowerName = normalizeText(deptName);

  const mappings = [
    { keywords: ['bilgisayar', 'yazılım', 'bilişim', "yönetim bilişim sistemleri", "siber güvenlik mühendisliği"], key: 'Bilgisayar Bilimi ve Bilgi Sistemleri' },
    { keywords: ['elektrik', 'elektronik', 'haberleşme', "havacılık elektroniği"], key: 'Mühendislik - Elektrik ve Elektronik' },
    { keywords: ['makine', 'mekanik', 'mekatronik'], key: 'Mühendislik - Mekanik' },
    { keywords: ['inşaat', 'yapı'], key: 'Mühendislik - İnşaat ve Yapı' },
    { keywords: ['kimya mühendisliği'], key: 'Mühendislik - Kimya' },
    { keywords: ['kimya'], key: 'Kimya' },
    { keywords: ['mimarlık', 'şehir'], key: 'Mimarlık ve Yapılı Çevre' },
    { keywords: ['matematik', "matematik mühendisliği"], key: 'Matematik' },
    { keywords: ['fizik'], key: 'Fizik ve Astronomi' },
    { keywords: ['biyoloji', 'moleküler', 'genetik'], key: 'Biyolojik Bilimler' },
    { keywords: ['istatistik', 'veri bilimi', 'yapay zeka', "yapay zeka ve veri mühendisliği"], key: 'Veri Bilimi ve Yapay Zeka' },
    { keywords: ['endüstri mühendisliği'], key: 'İstatistik ve Yöneylem Araştırması' },
    { keywords: ["bilgisayar mühendisliği", "yazılım mühendisliği", "yapay zekâ mühendisliği", "veri mühendisliği", "siber güvenlik mühendisliği", "bilişim sistemleri mühendisliği", "elektrik-elektronik mühendisliği", "elektronik ve haberleşme mühendisliği", "kontrol ve otomasyon mühendisliği", "mekatronik mühendisliği", "biyomedikal mühendisliği", "makine mühendisliği", "robotik mühendisliği", "otomotiv mühendisliği", "havacılık ve uzay mühendisliği", "imalat mühendisliği", "kimya mühendisliği", "metalurji ve malzeme mühendisliği", "nanoteknoloji mühendisliği", "biyomühendislik", "genetik mühendisliği", "enerji sistemleri mühendisliği", "nükleer enerji mühendisliği", "sistem mühendisliği"], key: 'Mühendislik ve Teknoloji' },
    { keywords: ['iktisat', 'ekonomi', "ekonomi ve finans"], key: 'Ekonomi ve Ekonometri' },
    { keywords: ['kamu yönetimi', 'siyaset', 'uluslararası ilişkiler'], key: 'Siyaset' },
    { keywords: ['işletme', 'yönetim'], key: 'İşletme ve Yönetim Çalışmaları' },
    { keywords: ['psikoloji', 'pdr'], key: 'Psikoloji' },
    { keywords: ['tarih'], key: 'Tarih' },
    { keywords: ['jeoloji'], key: 'Jeoloji' },
    { keywords: ['çevre'], key: 'Çevre Bilimleri' },
    { keywords: ['maden'], key: 'Maden ve Madencilik' },
    { keywords: ['petrol'], key: 'Mühendislik ve Petrol' },
    { keywords: ['malzeme', 'metalurji'], key: 'Malzeme Bilimleri' },
    { keywords: ['tasarım', 'grafik'], key: 'Sanat ve Tasarım' },
    { keywords: ['eğitim', 'öğretmen'], key: 'Eğitim ve Öğretim' },
    { keywords: ['muhasebe', 'finans'], key: 'Muhasebe ve Finans' },
    { keywords: ['hukuk'], key: 'Hukuk ve Hukuk Çalışmaları' },
    { keywords: ['hemşirelik'], key: 'Hemşirelik' },
    { keywords: ['tıp', 'ilaç'], key: 'İlaç' },
    { keywords: ['diş'], key: 'Diş Hekimliği' },
    { keywords: ['eczacılık'], key: 'Eczacılık ve Farmakoloji' },
  ];

  for (const mapping of mappings) {
    if (mapping.keywords.some(kw => lowerName.includes(kw))) {
      const rank = details[mapping.key];
      if (rank) return rank;
    }
  }
  return null;
};

const getTumaRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.tuma) return null;
  const details = uni.tuma;
  const lowerName = normalizeText(deptName);

  const mappings = [
    { keywords: ['mühendis', 'bilgisayar', 'elektrik', 'makine', 'inşaat', 'endüstri', 'yazılım'], key: 'Mühendislik' },
    { keywords: ['tıp', 'diş', 'hemşire', 'eczacılık', 'sağlık'], key: 'Tıp ve Sağlık Bilimleri' },
    { keywords: ['hukuk'], key: 'Hukuk' },
    { keywords: ['kamu yönetimi', 'siyaset', 'sosyoloji', 'tarih', 'ilişkiler'], key: 'Sosyal Bilimler' },
    { keywords: ['işletme', 'ekonomi', 'iktisat', 'finans', 'muhasebe'], key: 'İşletme ve Ekonomi' },
    { keywords: ['psikoloji'], key: 'Psikoloji' },
    { keywords: ['eğitim', 'öğretmen'], key: 'Eğitim Bilimleri' },
    { keywords: ['mimarlık', 'tasarım', 'sanat'], key: 'Sanat, Mimarlık, Tasarım' },
    { keywords: ['fizik', 'kimya', 'biyoloji', 'matematik', 'moleküler'], key: 'Fen ve Yaşam Bilimleri' },
  ];

  for (const mapping of mappings) {
    if (mapping.keywords.some(kw => lowerName.includes(kw))) {
      const rank = details[mapping.key];
      if (rank !== undefined && rank !== null) return rank;
    }
  }
  return details.genel || null;
};

// İstihdam verisini gösteren component
const EmploymentBadge = ({ rate }) => {
  if (rate === null || rate === undefined) {
    return <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>;
  }

  let color, bg, label;
  if (rate >= 80) {
    color = '#065f46';
    bg = '#d1fae5';
    label = '✅ Yüksek';
  } else if (rate >= 60) {
    color = '#92400e';
    bg = '#fef3c7';
    label = '📈 Orta';
  } else {
    color = '#991b1b';
    bg = '#fee2e2';
    label = '⚠️ Düşük';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        background: bg,
        color: color,
        whiteSpace: 'nowrap',
      }}
    >
      %{rate.toFixed(1)} {label}
    </span>
  );
};

export function DepartmentList({
  selectedUniKey,
  allDepartments,
  favorites,
  toggleFavorite,
  toggleCompare,
  compareList,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterEmployment, setFilterEmployment] = useState('ALL'); // Yeni filtre

  const filteredByUni =
    selectedUniKey === 'all'
      ? allDepartments
      : allDepartments.filter((dept) => dept.uniKey === selectedUniKey);

  const filteredData = filteredByUni.filter((dept) => {
    const searchLower = normalizeText(searchTerm);
    const deptName = normalizeText(dept.name);
    const matchesSearch = deptName.includes(searchLower);
    const matchesType = filterType === 'ALL' || dept.type === filterType;

    // İstihdam filtresi
    let matchesEmployment = true;
    if (filterEmployment !== 'ALL') {
      const emp = getEmploymentData(dept.name);
      const rate = emp?.rate || 0;
      if (filterEmployment === 'HIGH') matchesEmployment = rate >= 80;
      else if (filterEmployment === 'MEDIUM') matchesEmployment = rate >= 60 && rate < 80;
      else if (filterEmployment === 'LOW') matchesEmployment = rate < 60 && rate > 0;
      else if (filterEmployment === 'NO_DATA') matchesEmployment = rate === null || rate === undefined;
    }

    return matchesSearch && matchesType && matchesEmployment;
  });

  const totalCount = filteredByUni.length;
  const visibleCount = filteredData.length;

  const getTypeColor = (type) => {
    switch(type) {
      case 'SAY': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'EA': return { bg: '#fef3c7', color: '#b45309' };
      case 'SÖZ': return { bg: '#fce7f3', color: '#be185d' };
      case 'DİL': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'TYT': return { bg: '#d1fae5', color: '#065f46' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#475569', display: 'block', fontWeight: '600' }}>Toplam Program</span>
          <strong style={{ fontSize: '24px', color: '#0f172a' }}>{totalCount}</strong>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#0369a1', display: 'block', fontWeight: '600' }}>Görüntülenen</span>
          <strong style={{ fontSize: '24px', color: '#0284c7' }}>{visibleCount}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Bölüm adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 18px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', background: 'white' }}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none', fontWeight: '500', color: '#1a1a2e' }}
        >
          <option value="ALL">📊 Tüm Puan Türleri</option>
          <option value="SAY">📐 Sayısal (SAY)</option>
          <option value="EA">⚖️ Eşit Ağırlık (EA)</option>
          <option value="SÖZ">📖 Sözel (SÖZ)</option>
          <option value="DİL">🌍 Dil (DİL)</option>
          <option value="TYT">📝 TYT (2 Yıllık)</option>
        </select>

        <select
          value={filterEmployment}
          onChange={(e) => setFilterEmployment(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '14px', border: '2px solid #e2e8f0', fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none', fontWeight: '500', color: '#1a1a2e' }}
        >
          <option value="ALL">💼 Tüm İstihdam</option>
          <option value="HIGH">✅ Yüksek (%80+)</option>
          <option value="MEDIUM">📈 Orta (%60-80)</option>
          <option value="LOW">⚠️ Düşük (%60 altı)</option>
          <option value="NO_DATA">❓ Veri Yok</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #eef2f7', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '950px' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>Program / Bölüm Adı</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>Tür</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>Kontenjan</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>Sıralama (2025)</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>Puan (2025)</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>🌍 QS Subject</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>🏆 TÜMA</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155' }}>💼 İstihdam Oranı</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#334155', minWidth: '160px' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((dept, index) => {
                const rank = dept.rank2025 !== '-' && !isNaN(Number(dept.rank2025))
                  ? Number(dept.rank2025).toLocaleString('tr-TR')
                  : dept.rank2025;

                const isFav = favorites.includes(dept.id);
                const isComp = compareList.some((d) => d.id === dept.id);
                const typeColors = getTypeColor(dept.type);

                const subjectRank = getSubjectRank(dept.name, dept.uniKey);
                const tumaRank = getTumaRank(dept.name, dept.uniKey);
                const employment = getEmploymentData(dept.name);

                return (
                  <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? '#ffffff' : '#fafcff' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#1e293b' }}>{dept.name}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: typeColors.bg, color: typeColors.color }}>
                        {dept.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{dept.quota}</td>
                    <td style={{ padding: '14px 20px', fontWeight: '700', color: '#0f172a' }}>{rank}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{dept.score2025}</td>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#0ea5e9' }}>
                      {subjectRank ? `#${subjectRank}` : '-'}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#8b5cf6' }}>
                      {tumaRank ? `#${tumaRank}` : '-'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <EmploymentBadge rate={employment?.rate || null} />
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => toggleFavorite(dept.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', marginRight: '8px', color: isFav ? '#f59e0b' : '#94a3b8' }}
                      >
                        {isFav ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => toggleCompare(dept)}
                        style={{ background: isComp ? '#f59e0b' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: isComp ? '#fff' : '#1e293b', cursor: 'pointer' }}
                      >
                        {isComp ? '✓ Kıyaslanıyor' : '+ Kıyasla'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  😕 Aramanızla eşleşen bölüm bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}