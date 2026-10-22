// src/views/QSRankingsView.jsx

import { useState, useMemo } from 'react';
import {
  FaGlobeEurope,
  FaBookOpen,
  FaSearch,
  FaSyncAlt,
  FaUniversity,
  FaMedal,
  FaStar,
  FaChartLine,
  FaTimesCircle,
  FaFrown,
  FaLightbulb,
} from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { uniDatabase } from '../data/uniDatabase';

export function QSRankingsView() {
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
    if (rank === undefined || rank === null) return 'var(--text-muted)';
    const num = typeof rank === 'string' ? parseInt(rank) : rank;
    if (num <= 100) return 'var(--success)';
    if (num <= 300) return 'var(--cyan)';
    if (num <= 500) return 'var(--accent)';
    return 'var(--danger)';
  };

  // Rozet sınıfı belirle
  const getQSRankTag = (rank) => {
    const num = typeof rank === 'string' ? parseInt(rank) : rank;
    if (num <= 100) return 'tag tag-success';
    if (num <= 300) return 'tag tag-cyan';
    if (num <= 500) return 'tag tag-warn';
    return 'tag tag-danger';
  };

  return (
    <div>
      <PageHeader
        kicker="SIRALAMALAR"
        icon={FaGlobeEurope}
        title="QS Dünya Üniversite Sıralamaları"
        desc="Türkiye'deki üniversitelerin QS Dünya Sıralamaları ve alan bazlı performansları."
      />

      {/* Filtreler */}
      <div className="toolbar">
        {/* Subject Seçimi */}
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaBookOpen /> Alan Seç</span></label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="ALL">Tüm Alanlar (Genel Sıralama)</option>
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
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
            <option value="rank">QS'ye Göre</option>
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
                  <th className="center">
                    {selectedSubject === 'ALL'
                      ? <span className="meta-item"><FaGlobeEurope /> QS Genel</span>
                      : <span className="meta-item"><FaBookOpen /> {selectedSubject}</span>}
                  </th>
                  <th className="center"><span className="meta-item"><FaGlobeEurope /> QS Genel</span></th>
                  <th className="center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((uni, index) => {
                  const subjectRank = selectedSubject !== 'ALL'
                    ? uni.qsDetails?.[selectedSubject]
                    : uni.qs;
                  const hasSubjectRank = subjectRank !== undefined && subjectRank !== null;

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
                      <td
                        className={`center ${hasSubjectRank ? 'td-strong' : 'text-muted'}`}
                        style={hasSubjectRank ? { color: getQSRankColor(subjectRank) } : undefined}
                      >
                        {hasSubjectRank ? formatQSRank(subjectRank) : '-'}
                      </td>
                      <td
                        className={`center ${uni.qs ? 'td-strong' : 'text-muted'}`}
                        style={uni.qs ? { color: getQSRankColor(uni.qs) } : undefined}
                      >
                        {uni.qs ? `#${uni.qs}` : '-'}
                      </td>
                      <td className="center">
                        {hasSubjectRank ? (
                          <span className={getQSRankTag(subjectRank)}>
                            {(() => {
                              const num = typeof subjectRank === 'string' ? parseInt(subjectRank) : subjectRank;
                              if (num <= 100) return <><FaMedal /> Dünya 100</>;
                              if (num <= 300) return <><FaStar /> İlk 300</>;
                              if (num <= 500) return <><FaChartLine /> İlk 500</>;
                              return <><FaGlobeEurope /> Dünya</>;
                            })()}
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
          <span className="meta-item"><FaLightbulb /> <strong>İpucu:</strong></span> Bir alan seçerek o alandaki sıralamayı görebilir, üniversite arayarak filtreleyebilirsiniz.
          {selectedSubject !== 'ALL' && (
            <span> • <strong>{subjectCount}</strong> üniversite bu alanda sıralamaya sahip.</span>
          )}
        </span>
      </div>
    </div>
  );
}
