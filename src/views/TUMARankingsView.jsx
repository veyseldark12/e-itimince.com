// src/views/TUMARankingsView.jsx

import { useState, useMemo } from 'react';
import {
  FaTrophy,
  FaSchool,
  FaSearch,
  FaSyncAlt,
  FaUniversity,
  FaMedal,
  FaStar,
  FaChartLine,
  FaChartBar,
  FaTimesCircle,
  FaFrown,
  FaLightbulb,
} from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { uniDatabase } from '../data/uniDatabase';

export function TUMARankingsView() {
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
    if (rank === undefined || rank === null) return 'var(--text-muted)';
    if (rank <= 10) return 'var(--success)';
    if (rank <= 30) return 'var(--cyan)';
    if (rank <= 50) return 'var(--accent)';
    return 'var(--danger)';
  };

  // Rozet sınıfı belirle
  const getTUMATag = (rank) => {
    if (rank <= 10) return 'tag tag-success';
    if (rank <= 30) return 'tag tag-cyan';
    if (rank <= 50) return 'tag tag-warn';
    return 'tag tag-danger';
  };

  const getTUMALabel = (rank) => {
    if (rank === undefined || rank === null) return 'Veri Yok';
    if (rank <= 10) return <><FaMedal /> En İyi 10</>;
    if (rank <= 30) return <><FaStar /> İlk 30</>;
    if (rank <= 50) return <><FaChartLine /> İlk 50</>;
    return <><FaChartBar /> Memnuniyet</>;
  };

  return (
    <div>
      <PageHeader
        kicker="SIRALAMALAR"
        icon={FaTrophy}
        title="TÜMA Memnuniyet Sıralamaları"
        desc="Türkiye Üniversite Memnuniyet Araştırması (TÜMA) - Öğrenci memnuniyetine göre sıralama."
      />

      {/* Filtreler */}
      <div className="toolbar">
        {/* Fakülte Seçimi */}
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaSchool /> Fakülte / Alan Seç</span></label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="ALL">Genel Memnuniyet</option>
            {allFaculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
        </div>

        {/* Arama */}
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaSearch /> Üniversite Ara</span></label>
          <input
            type="text"
            placeholder="Üniversite adı..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sıralama */}
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaSyncAlt /> Sıralama</span></label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rank">TÜMA'ya Göre</option>
            <option value="name">Alfabetik</option>
          </select>
        </div>

        {/* Sonuç sayısı */}
        <div className="field-static">
          <span className="field-static-label">Sonuç</span>
          <span className="field-static-value">{filteredUniversities.length}</span>
        </div>
      </div>

      {/* Tablo */}
      {filteredUniversities.length > 0 ? (
        <div className="dtable-wrap">
          <div className="dtable-scroll">
            <table className="dtable">
              <thead>
                <tr>
                  <th>#</th>
                  <th><span className="meta-item"><FaUniversity /> Üniversite</span></th>
                  {selectedFaculty !== 'ALL' && (
                    <th className="center">
                      <span className="meta-item"><FaSchool /> {selectedFaculty}</span>
                    </th>
                  )}
                  <th className="center"><span className="meta-item"><FaTrophy /> Genel TÜMA</span></th>
                  <th className="center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((uni, index) => {
                  const facultyRank = selectedFaculty !== 'ALL'
                    ? uni.tuma?.[selectedFaculty]
                    : uni.tuma?.genel;
                  const hasFacultyRank = facultyRank !== undefined && facultyRank !== null;

                  return (
                    <tr key={uni.key}>
                      <td className="text-muted">
                        {index + 1}
                      </td>
                      <td>
                        <div className="uni-cell">
                          <span className="uni-cell-icon">
                            <uni.icon />
                          </span>
                          <span>{uni.name}</span>
                        </div>
                      </td>
                      {selectedFaculty !== 'ALL' && (
                        <td
                          className={`center ${hasFacultyRank ? 'td-strong' : 'text-muted'}`}
                          style={hasFacultyRank ? { color: getTUMAColor(facultyRank) } : undefined}
                        >
                          {hasFacultyRank ? `#${facultyRank}` : '-'}
                        </td>
                      )}
                      <td
                        className={`center ${uni.tuma?.genel ? 'td-strong' : 'text-muted'}`}
                        style={uni.tuma?.genel ? { color: getTUMAColor(uni.tuma.genel) } : undefined}
                      >
                        {uni.tuma?.genel ? `#${uni.tuma.genel}` : '-'}
                      </td>
                      <td className="center">
                        {hasFacultyRank ? (
                          <span className={getTUMATag(facultyRank)}>
                            {getTUMALabel(facultyRank)}
                          </span>
                        ) : (
                          <span className="text-muted text-sm meta-item"><FaTimesCircle /> Veri Yok</span>
                        )}
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
          <div className="empty-icon"><FaFrown /></div>
          <h3 className="empty-title">Bu kritere uygun üniversite bulunamadı.</h3>
        </div>
      )}

      {/* Dipnot */}
      <div className="note">
        <span>
          <span className="meta-item"><FaLightbulb /> <strong>İpucu:</strong></span> Bir fakülte/alan seçerek o alandaki memnuniyet sıralamasını görebilir, üniversite arayarak filtreleyebilirsiniz.
          {selectedFaculty !== 'ALL' && (
            <span> • <strong>{facultyCount}</strong> üniversite bu alanda sıralamaya sahip.</span>
          )}
        </span>
      </div>
    </div>
  );
}
