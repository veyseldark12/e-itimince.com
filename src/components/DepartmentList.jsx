// src/components/DepartmentList.jsx

import { useState } from 'react';
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaChartLine,
  FaExclamationTriangle,
  FaFrown,
  FaCheck,
  FaGlobeAsia,
  FaTrophy,
  FaBriefcase,
} from 'react-icons/fa';
import { getEmploymentData } from '../utils/employmentMatcher';
import { normalizeText, getSubjectRank, getTumaRank } from '../utils/rankHelpers';

// İstihdam verisini gösteren component
const EmploymentBadge = ({ rate }) => {
  if (rate === null || rate === undefined) {
    return <span className="text-faint">-</span>;
  }

  let variant, label, Icon;
  if (rate >= 80) {
    variant = 'tag-success';
    label = 'Yüksek';
    Icon = FaCheckCircle;
  } else if (rate >= 60) {
    variant = 'tag-warn';
    label = 'Orta';
    Icon = FaChartLine;
  } else {
    variant = 'tag-danger';
    label = 'Düşük';
    Icon = FaExclamationTriangle;
  }

  return (
    <span className={`tag ${variant}`}>
      %{rate.toFixed(1)} <Icon /> {label}
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

  const getTypeClass = (type) => {
    switch(type) {
      case 'SAY': return 'tag-cyan';
      case 'EA': return 'tag-warn';
      case 'SÖZ': return 'tag-danger';
      case 'DİL': return 'tag-violet';
      case 'TYT': return 'tag-success';
      default: return '';
    }
  };

  return (
    <div>
      <div className="metric-strip mb-24">
        <div className="stat-tile">
          <div className="stat-label">Toplam Program</div>
          <div className="stat-value">{totalCount}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Görüntülenen</div>
          <div className="stat-value">{visibleCount}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="field">
          <label className="field-label">Bölüm Ara</label>
          <input
            type="text"
            placeholder="Bölüm adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Puan Türü</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">Tüm Puan Türleri</option>
            <option value="SAY">Sayısal (SAY)</option>
            <option value="EA">Eşit Ağırlık (EA)</option>
            <option value="SÖZ">Sözel (SÖZ)</option>
            <option value="DİL">Dil (DİL)</option>
            <option value="TYT">TYT (2 Yıllık)</option>
          </select>
        </div>

        <div className="field">
          <label className="field-label">İstihdam</label>
          <select value={filterEmployment} onChange={(e) => setFilterEmployment(e.target.value)}>
            <option value="ALL">Tüm İstihdam</option>
            <option value="HIGH">Yüksek (%80+)</option>
            <option value="MEDIUM">Orta (%60-80)</option>
            <option value="LOW">Düşük (%60 altı)</option>
            <option value="NO_DATA">Veri Yok</option>
          </select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaFrown />
          </div>
          <h3 className="empty-title">Sonuç bulunamadı</h3>
          <p className="text-muted">Aramanızla eşleşen bölüm bulunamadı.</p>
        </div>
      ) : (
        <div className="dtable-wrap">
          <div className="dtable-scroll">
            <table className="dtable">
              <thead>
                <tr>
                  <th>Program / Bölüm Adı</th>
                  <th>Tür</th>
                  <th>Kontenjan</th>
                  <th>Sıralama (2025)</th>
                  <th>Puan (2025)</th>
                  <th>
                    <span className="meta-item">
                      <FaGlobeAsia /> QS Subject
                    </span>
                  </th>
                  <th>
                    <span className="meta-item">
                      <FaTrophy /> TÜMA
                    </span>
                  </th>
                  <th>
                    <span className="meta-item">
                      <FaBriefcase /> İstihdam Oranı
                    </span>
                  </th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((dept) => {
                  const rank = dept.rank2025 !== '-' && !isNaN(Number(dept.rank2025))
                    ? Number(dept.rank2025).toLocaleString('tr-TR')
                    : dept.rank2025;

                  const isFav = favorites.includes(dept.id);
                  const isComp = compareList.some((d) => d.id === dept.id);

                  const subjectRank = getSubjectRank(dept.name, dept.uniKey);
                  const tumaRank = getTumaRank(dept.name, dept.uniKey);
                  const employment = getEmploymentData(dept.name);

                  return (
                    <tr key={dept.id}>
                      <td className="td-strong">{dept.name}</td>
                      <td>
                        <span className={`tag ${getTypeClass(dept.type)}`}>{dept.type}</span>
                      </td>
                      <td className="text-muted">{dept.quota}</td>
                      <td className="td-strong">{rank}</td>
                      <td className="text-muted">{dept.score2025}</td>
                      <td>
                        {subjectRank ? <span className="tag tag-cyan">#{subjectRank}</span> : '-'}
                      </td>
                      <td>
                        {tumaRank ? <span className="tag tag-violet">#{tumaRank}</span> : '-'}
                      </td>
                      <td>
                        <EmploymentBadge rate={employment?.rate || null} />
                      </td>
                      <td>
                        <div className="flex">
                          <button
                            className="btn btn-ghost btn-sm"
                            aria-label="Favorilere ekle"
                            onClick={() => toggleFavorite(dept.id)}
                            style={{ color: isFav ? 'var(--accent)' : 'var(--text-faint)' }}
                          >
                            {isFav ? <FaStar /> : <FaRegStar />}
                          </button>
                          <button
                            className={`btn ${isComp ? 'btn-primary' : 'btn-outline'} btn-sm`}
                            onClick={() => toggleCompare(dept)}
                          >
                            {isComp ? (
                              <>
                                <FaCheck /> Kıyaslanıyor
                              </>
                            ) : (
                              '+ Kıyasla'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
