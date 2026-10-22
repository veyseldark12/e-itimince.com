// src/views/EmploymentAnalysisView.jsx

import { useState, useMemo } from 'react';
import { FaBriefcase, FaChartBar, FaFrown, FaGraduationCap, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { bachelorEmploymentData, associateEmploymentData } from '../data/employmentData';

export function EmploymentAnalysisView() {
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

  // İstatistikler (orijinal diziyi mutasyona uğratmadan hesaplanır)
  const totalDepts = employmentStats.length;
  const avgRate = totalDepts > 0
    ? (employmentStats.reduce((sum, d) => sum + d.rate, 0) / totalDepts).toFixed(1)
    : '0.0';
  const highestRate = totalDepts > 0 ? [...employmentStats].sort((a, b) => b.rate - a.rate)[0] : null;
  const lowestRate = totalDepts > 0 ? [...employmentStats].sort((a, b) => a.rate - b.rate)[0] : null;

  // İstihdam oranı dağılımı (görselleştirme)
  const rateBands = useMemo(() => {
    const total = employmentStats.length || 1;
    const high = employmentStats.filter(d => d.rate >= 80).length;
    const mid = employmentStats.filter(d => d.rate >= 60 && d.rate < 80).length;
    const low = employmentStats.filter(d => d.rate < 60).length;

    return [
      { key: 'high', label: 'Yüksek (≥ %80)', count: high, pct: (high / total) * 100, tag: 'tag-success', bar: 'var(--success)' },
      { key: 'mid', label: 'Orta (%60 - %79)', count: mid, pct: (mid / total) * 100, tag: 'tag-warn', bar: 'var(--accent)' },
      { key: 'low', label: 'Düşük (< %60)', count: low, pct: (low / total) * 100, tag: 'tag-danger', bar: 'var(--danger)' },
    ];
  }, [employmentStats]);

  const getRateTag = (rate) => {
    if (rate >= 80) return 'tag tag-success';
    if (rate >= 60) return 'tag tag-warn';
    return 'tag tag-danger';
  };

  const getRateLabel = (rate) => {
    if (rate >= 80) return 'Yüksek';
    if (rate >= 60) return 'Orta';
    return 'Düşük';
  };

  return (
    <div>
      <PageHeader
        icon={FaBriefcase}
        kicker="ANALİZ"
        title="Bölüm İstihdam Analizi"
        desc="TÜİK Yükseköğretim İstihdam Göstergeleri (2025) - Bölüm bazlı istihdam oranları."
      />

      {/* Özet Kartları */}
      <div className="metric-strip mb-24">
        <div className="stat-tile">
          <div className="stat-label">Toplam Bölüm</div>
          <div className="stat-value">{totalDepts}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Ortalama İstihdam</div>
          <div className="stat-value">%{avgRate}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">En Yüksek</div>
          <div className="text-sm text-muted">
            {highestRate ? `${highestRate.name.slice(0, 20)}...` : '-'}
          </div>
          <div className="tag tag-success mt-8">
            {highestRate ? `%${highestRate.rate.toFixed(1)}` : '-'}
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">En Düşük</div>
          <div className="text-sm text-muted">
            {lowestRate ? `${lowestRate.name.slice(0, 20)}...` : '-'}
          </div>
          <div className="tag tag-danger mt-8">
            {lowestRate ? `%${lowestRate.rate.toFixed(1)}` : '-'}
          </div>
        </div>
      </div>

      {/* İstihdam Dağılımı */}
      <div className="panel mb-24">
        <h3 className="panel-title"><FaChartBar /> İstihdam Dağılımı</h3>
        {rateBands.map(band => (
          <div key={band.key} className="mb-16">
            <div className="flex-between">
              <span className="text-sm text-muted">{band.label}</span>
              <span className={`tag ${band.tag}`}>{band.count} bölüm</span>
            </div>
            <div className="progress mt-8">
              <span style={{ width: `${band.pct}%`, background: band.bar }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="toolbar">
        <div className="field">
          <label className="field-label"><FaSearch /> Bölüm Ara</label>
          <input
            type="text"
            placeholder="Bölüm ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label"><FaGraduationCap /> Tür</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">Tümü</option>
            <option value="Lisans">Lisans</option>
            <option value="Ön Lisans">Ön Lisans</option>
          </select>
        </div>

        <div className="field">
          <label className="field-label"><FaSyncAlt /> Sıralama</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rate">İstihdama Göre</option>
            <option value="name">Alfabetik</option>
          </select>
        </div>

        <div className="field-static">
          <span className="field-static-label">Sonuç</span>
          <span className="field-static-value">{filteredStats.length}</span>
        </div>
      </div>

      {/* Tablo */}
      {filteredStats.length > 0 ? (
        <div className="dtable-wrap">
          <div className="dtable-scroll">
            <table className="dtable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bölüm</th>
                  <th>Tür</th>
                  <th className="center">İstihdam Oranı</th>
                  <th className="center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((item, index) => (
                  <tr key={item.name}>
                    <td className="text-muted">{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      <span className={`tag ${item.type === 'Lisans' ? 'tag-cyan' : 'tag-violet'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="center td-strong">%{item.rate.toFixed(1)}</td>
                    <td className="center">
                      <span className={getRateTag(item.rate)}>
                        {getRateLabel(item.rate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FaFrown /></div>
          <h3 className="empty-title">Bu kritere uygun bölüm bulunamadı.</h3>
        </div>
      )}
    </div>
  );
}
