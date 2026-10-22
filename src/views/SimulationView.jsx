// src/views/SimulationView.jsx

import { useState } from 'react';
import {
  FaUniversity,
  FaBullseye,
  FaDownload,
  FaTrophy,
  FaStar,
  FaSearch,
  FaArrowDown,
  FaMapMarkerAlt,
  FaSchool,
  FaChartBar,
  FaBookOpen,
  FaGlobeEurope,
  FaBriefcase,
  FaCheckCircle,
} from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
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

  const getTypeTag = (type) => {
    switch(type) {
      case 'SAY': return 'tag tag-cyan';
      case 'EA': return 'tag tag-warn';
      case 'SÖZ': return 'tag tag-violet';
      case 'DİL': return 'tag tag-accent';
      case 'TYT': return 'tag tag-success';
      default: return 'tag';
    }
  };

  return (
    <div>
      <PageHeader
        kicker="ARAÇLAR"
        icon={FaBullseye}
        title="Yerleşme Simülasyonu"
        desc="Tüm üniversite ve bölümleri sıralama, puan ve kriterlere göre filtreleyin."
        actions={
          filtered.length > 0 && (
            <button className="btn btn-primary" onClick={exportToExcel}>
              <FaDownload /> Excel İndir ({filtered.length} kayıt)
            </button>
          )
        }
      />

      <div className="mb-24">
        <div className="note mb-16">Arama yapmak istediğiniz kriter türünü seçin:</div>
        <div className="segmented">
          <button
            className={`segment ${searchMode === 'rank' ? 'active' : ''}`}
            onClick={() => {
              setSearchMode('rank');
              setMinScore('');
              setMaxScore('');
            }}
          >
            <span className="meta-item"><FaTrophy /> Sıralama ile Ara</span>
          </button>
          <button
            className={`segment ${searchMode === 'score' ? 'active' : ''}`}
            onClick={() => {
              setSearchMode('score');
              setMinRank('');
              setMaxRank('');
            }}
          >
            <span className="meta-item"><FaStar /> Puan ile Ara</span>
          </button>
        </div>
      </div>

      {/* Filtreleme Alanı */}
      <div className="toolbar">
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaSearch /> Bölüm / Üniversite Ara</span></label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bölüm veya üniversite adı..."
          />
        </div>

        {searchMode === 'rank' ? (
          <>
            <div className="field">
              <label className="field-label"><span className="meta-item"><FaTrophy /> Min Sıralama</span></label>
              <input
                type="number"
                value={minRank}
                onChange={(e) => setMinRank(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Min"
                min="1"
                step="100"
              />
            </div>
            <div className="field">
              <label className="field-label"><span className="meta-item"><FaArrowDown /> Max Sıralama</span></label>
              <input
                type="number"
                value={maxRank}
                onChange={(e) => setMaxRank(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Max"
                min="1"
                step="100"
              />
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label className="field-label"><span className="meta-item"><FaStar /> Min Puan</span></label>
              <input
                type="number"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="Min"
                step="0.01"
              />
            </div>
            <div className="field">
              <label className="field-label"><span className="meta-item"><FaStar /> Max Puan</span></label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="Max"
                step="0.01"
              />
            </div>
          </>
        )}

        <div className="field">
          <label className="field-label"><span className="meta-item"><FaMapMarkerAlt /> Şehir</span></label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="ALL">Tüm Şehirler</option>
            {allCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label"><span className="meta-item"><FaSchool /> Üniversite Tipi</span></label>
          <select value={selectedUniType} onChange={(e) => setSelectedUniType(e.target.value)}>
            <option value="ALL">Tümü</option>
            <option value="Devlet">Devlet</option>
            <option value="Vakıf">Vakıf</option>
          </select>
        </div>

        <div className="field">
          <label className="field-label"><span className="meta-item"><FaChartBar /> Puan Türü</span></label>
          <select value={simFilterType} onChange={(e) => setSimFilterType(e.target.value)}>
            <option value="ALL">Tümü</option>
            <option value="SAY">Sayısal (SAY)</option>
            <option value="EA">Eşit Ağırlık (EA)</option>
            <option value="SÖZ">Sözel (SÖZ)</option>
            <option value="DİL">Dil (DİL)</option>
            <option value="TYT">TYT (2 Yıllık)</option>
          </select>
        </div>

        <div className="field-static">
          <span className="field-static-label">Sonuç</span>
          <span className="field-static-value">{totalCount}</span>
        </div>
      </div>

      {/* İstatistik Kartları */}
      {filtered.length > 0 && (
        <div className="metric-strip mb-24">
          <div className="stat-tile">
            <div className="stat-label"><span className="meta-item"><FaBookOpen /> Toplam Bölüm</span></div>
            <div className="stat-value">{totalCount}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label"><span className="meta-item"><FaUniversity /> Üniversite</span></div>
            <div className="stat-value">{uniCount}</div>
          </div>
          {minRankFound && (
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaTrophy /> En İyi Sıralama</span></div>
              <div className="stat-value">#{minRankFound.toLocaleString('tr-TR')}</div>
            </div>
          )}
          {maxRankFound && (
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaArrowDown /> En Düşük Sıralama</span></div>
              <div className="stat-value">#{maxRankFound.toLocaleString('tr-TR')}</div>
            </div>
          )}
        </div>
      )}

      {/* Sonuç Tablosu */}
      {filtered.length > 0 ? (
        <div className="dtable-wrap">
          <div className="dtable-scroll">
            <table className="dtable">
              <thead>
                <tr>
                  <th className="center">#</th>
                  <th><span className="meta-item"><FaUniversity /> Üniversite</span></th>
                  <th><span className="meta-item"><FaBookOpen /> Bölüm Adı</span></th>
                  <th className="center"><span className="meta-item"><FaChartBar /> Tür</span></th>
                  <th className="center"><span className="meta-item"><FaTrophy /> Sıralama</span></th>
                  <th className="center"><span className="meta-item"><FaStar /> Puan</span></th>
                  <th className="center"><span className="meta-item"><FaGlobeEurope /> QS</span></th>
                  <th className="center"><span className="meta-item"><FaTrophy /> TÜMA</span></th>
                  <th className="center"><span className="meta-item"><FaBriefcase /> İstihdam</span></th>
                  <th className="center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dept, index) => {
                  const rank = dept.rank2025 !== '-' && !isNaN(Number(dept.rank2025)) ? Number(dept.rank2025).toLocaleString('tr-TR') : dept.rank2025;
                  const score = dept.score2025 !== '-' && dept.score2025 ? dept.score2025 : '-';
                  const uni = Object.values(uniDatabase).find((u) => u.key === dept.uniKey);
                  const isComp = compareList.some((d) => d.id === dept.id);

                  const subjectRank = getSubjectRank(dept.name, dept.uniKey);
                  const tumaRank = getTumaRank(dept.name, dept.uniKey);
                  const employment = getEmploymentData(dept.name);

                  return (
                    <tr key={dept.id}>
                      <td className="center text-faint">{index + 1}</td>
                      <td>
                        <span className="uni-cell">
                          <span className="uni-cell-icon">
                            {uni?.icon ? <uni.icon /> : <FaUniversity />}
                          </span>
                          <span>{dept.uniName}</span>
                        </span>
                      </td>
                      <td>{dept.name}</td>
                      <td className="center">
                        <span className={getTypeTag(dept.type)}>{dept.type}</span>
                      </td>
                      <td className="center td-strong text-accent">{rank}</td>
                      <td className="center td-strong">{score}</td>
                      <td className="center">{subjectRank ? `#${subjectRank}` : '-'}</td>
                      <td className="center">{tumaRank ? `#${tumaRank}` : '-'}</td>
                      <td className="center">
                        {employment?.rate ? (
                          <span className={employment.rate >= 80 ? 'tag tag-success' : employment.rate >= 60 ? 'tag tag-warn' : 'tag tag-danger'}>
                            %{employment.rate.toFixed(1)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="center">
                        <button
                          className={`btn btn-sm ${isComp ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => toggleCompare(dept)}
                        >
                          {isComp ? <><FaCheckCircle /> Kıyas</> : '+ Kıyasla'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FaSearch /></div>
          <h3 className="empty-title">Sonuç bulunamadı</h3>
          <p>Bu kriterlere uygun bölüm bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
