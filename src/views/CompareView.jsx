// src/views/CompareView.jsx

import { FaBalanceScale, FaSearch, FaTimes, FaGlobe, FaTrophy } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { getSubjectRank, getTumaRank } from '../utils/rankHelpers';

export function CompareView({ compareList, toggleCompare }) {
  return (
    <div>
      <PageHeader
        icon={FaBalanceScale}
        kicker="KIYASLAMA"
        title="Bölüm Kıyaslama Modülü"
        desc="Seçtiğiniz en fazla 3 bölümü yan yana kriterleriyle mukayese edin."
      />

      {compareList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaSearch />
          </div>
          <h3 className="empty-title">Kıyaslama listesi boş</h3>
          <p className="text-muted">Henüz kıyaslama listesine bölüm eklemediniz.</p>
        </div>
      ) : (
        <div className="grid-auto grid-3">
          {compareList.map((dept) => {
            const qsRank = getSubjectRank(dept.name, dept.uniKey);
            const tumaRank = getTumaRank(dept.name, dept.uniKey);

            return (
              <div key={dept.id} className="panel">
                <div className="flex-between mb-16">
                  <span className="tag tag-accent">{dept.uniName}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    aria-label="Kıyaslamadan çıkar"
                    onClick={() => toggleCompare(dept)}
                  >
                    <FaTimes />
                  </button>
                </div>

                <h3 className="block-title">{dept.name}</h3>

                <div className="grid-auto mb-16">
                  <div className="chip">
                    <div className="stat-label">Fakülte</div>
                    {dept.faculty}
                  </div>
                  <div className="chip">
                    <div className="stat-label">Puan Türü &amp; Dil</div>
                    {dept.type} • {dept.lang}
                  </div>
                  <div className="chip">
                    <div className="stat-label">2025 Başarı Sırası</div>
                    <span className="td-strong">{dept.rank2025}</span>
                  </div>
                  <div className="chip">
                    <div className="stat-label">Kontenjan</div>
                    <span className="td-strong">{dept.quota}</span>
                  </div>
                </div>

                <div className="grid-auto">
                  <div className="chip">
                    <div className="stat-label">
                      <FaGlobe /> QS Subject Sıralaması
                    </div>
                    {qsRank ? (
                      <span className="tag tag-cyan">#{qsRank}</span>
                    ) : (
                      <span className="text-faint">–</span>
                    )}
                  </div>
                  <div className="chip">
                    <div className="stat-label">
                      <FaTrophy /> TÜMA Sıralaması
                    </div>
                    {tumaRank ? (
                      <span className="tag tag-violet">#{tumaRank}</span>
                    ) : (
                      <span className="text-faint">–</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
