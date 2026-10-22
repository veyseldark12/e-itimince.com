// src/views/UniversitiesView.jsx

import { useState } from 'react';
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaLanguage,
  FaCalendarAlt,
  FaGraduationCap,
  FaPlane,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { DepartmentList } from '../components/DepartmentList';
import { PageHeader } from '../components/PageHeader';
import { uniDatabase } from '../data/uniDatabase';

// Üniversitenin gerçek logosunu gösterir; logo yüklenemezse ikona geri düşer.
function UniLogo({ uni }) {
  const [failed, setFailed] = useState(false);
  const Icon = uni.icon;

  return (
    <div className="uni-logo" style={{ borderColor: uni.color }}>
      {uni.logo && !failed ? (
        <img
          src={uni.logo}
          alt={`${uni.name} logosu`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon />
      )}
    </div>
  );
}

export function UniversitiesView({
  selectedUniKey,
  setSelectedUniKey,
  allDepartments,
  favorites,
  toggleFavorite,
  toggleCompare,
  compareList,
}) {
  const selectedUni = selectedUniKey !== 'all' ? uniDatabase[selectedUniKey] : null;

  // Tüm Üniversiteler Görünümü
  if (selectedUniKey === 'all') {
    return (
      <div>
        <PageHeader
          kicker="KEŞFET"
          icon={FaUniversity}
          title="Tüm Üniversiteler"
          desc="Aşağıdaki üniversitelerden birini seçerek bölümlerini inceleyebilirsiniz."
        />

        <div className="grid-auto grid-3">
          {Object.values(uniDatabase).map((uni) => (
            <div
              key={uni.key}
              className="uni-card animate-up"
              onClick={() => setSelectedUniKey(uni.key)}
              style={{ borderColor: uni.color }}
            >
              <div className="uni-card-top">
                <UniLogo uni={uni} />
                <div>
                  <h3 className="uni-name">{uni.name}</h3>
                  <div className="meta-row">
                    <span className={`tag ${uni.type === 'Vakıf' ? 'tag-warn' : 'tag-cyan'}`}>
                      {uni.type}
                    </span>
                    <span className="meta-item">
                      <FaMapMarkerAlt /> {uni.city}
                    </span>
                    <span className="meta-item">
                      <FaLanguage /> {uni.lang}
                    </span>
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <p className="card-desc">{uni.desc}</p>

              {/* EK VERİLER (Kartta) */}
              <div className="metric-strip mb-16">
                {uni.qs && (
                  <div className="stat-tile">
                    <div className="stat-label">QS Dünya</div>
                    <div className="stat-value">#{uni.qs}</div>
                  </div>
                )}
                {uni.tuma?.genel && (
                  <div className="stat-tile">
                    <div className="stat-label">TÜMA Genel</div>
                    <div className="stat-value">#{uni.tuma.genel}</div>
                  </div>
                )}
                {uni.internationalStudents && (
                  <div className="stat-tile">
                    <div className="stat-label">Uluslararası Öğrenci</div>
                    <div className="stat-value">%{uni.internationalStudents}</div>
                  </div>
                )}
                {uni.totalStudents && (
                  <div className="stat-tile">
                    <div className="stat-label">Öğrenci Sayısı</div>
                    <div className="stat-value">{uni.totalStudents.toLocaleString('tr-TR')}</div>
                  </div>
                )}
              </div>

              {/* Alt Bilgi */}
              <div className="card-foot">
                <div className="flex-wrap">
                  <span className="text-sm meta-item">
                    <FaCalendarAlt /> Kuruluş: {uni.established}
                  </span>
                  {uni.erasmus && (
                    <span className="tag tag-success">
                      <FaPlane /> Erasmus
                    </span>
                  )}
                </div>
                <span className="link-arrow">Bölümleri İncele →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Seçili üniversite detay görünümü
  return (
    <div>
      {/* Başlık + Geri Butonu */}
      <PageHeader
        kicker="ÜNİVERSİTE DETAYI"
        icon={selectedUni?.icon}
        title={selectedUni ? selectedUni.name : 'Üniversite'}
        actions={
          <button className="btn btn-outline" onClick={() => setSelectedUniKey('all')}>
            <FaArrowLeft /> Tüm Üniversitelere Dön
          </button>
        }
      />

      {/* Üniversite Detay Paneli */}
      {selectedUni && (
        <div className="panel panel-lg mb-24">
          <div className="uni-card-top">
            <UniLogo uni={selectedUni} />
            <div>
              <div className="meta-row mb-16">
                <span className={`tag ${selectedUni.type === 'Vakıf' ? 'tag-warn' : 'tag-cyan'}`}>
                  {selectedUni.type}
                </span>
                <span className="meta-item">
                  <FaMapMarkerAlt /> {selectedUni.city}
                </span>
                <span className="meta-item">
                  <FaLanguage /> {selectedUni.lang}
                </span>
                <span className="meta-item">
                  <FaCalendarAlt /> {selectedUni.established}
                </span>
              </div>
              <p className="card-desc">{selectedUni.desc}</p>
            </div>
          </div>

          {/* Detaylı Ek Veriler */}
          <div className="metric-strip mt-24">
            {selectedUni.qs && (
              <div className="stat-tile">
                <div className="stat-label">QS Dünya Sıralaması</div>
                <div className="stat-value">#{selectedUni.qs}</div>
              </div>
            )}
            {selectedUni.tuma?.genel && (
              <div className="stat-tile">
                <div className="stat-label">TÜMA Genel</div>
                <div className="stat-value">#{selectedUni.tuma.genel}</div>
              </div>
            )}
            {selectedUni.internationalStudents && (
              <div className="stat-tile">
                <div className="stat-label">Uluslararası Öğrenci</div>
                <div className="stat-value">%{selectedUni.internationalStudents}</div>
              </div>
            )}
            {selectedUni.totalStudents && (
              <div className="stat-tile">
                <div className="stat-label">Toplam Öğrenci</div>
                <div className="stat-value">
                  <FaGraduationCap /> {selectedUni.totalStudents.toLocaleString('tr-TR')}
                </div>
              </div>
            )}
            <div className="stat-tile">
              <div className="stat-label">Uluslararası Program</div>
              <div className="stat-value">
                <span className={`tag ${selectedUni.erasmus ? 'tag-success' : 'tag-danger'}`}>
                  {selectedUni.erasmus ? (
                    <>
                      <FaCheckCircle /> Erasmus / Değişim
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Yok
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* QS Detayları (varsa) */}
          {selectedUni.qsDetails && Object.keys(selectedUni.qsDetails).length > 0 && (
            <div className="mt-24">
              <h4 className="block-title">QS Alan Sıralamaları</h4>
              <div className="grid-auto grid-3">
                {Object.entries(selectedUni.qsDetails).map(([alan, deger]) => (
                  <div key={alan} className="kv-row">
                    <span className="kv-key">{alan}</span>
                    <span className="kv-val">#{deger}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TÜMA Detayları (varsa) */}
          {selectedUni.tuma && Object.keys(selectedUni.tuma).filter(k => k !== 'genel').length > 0 && (
            <div className="mt-16">
              <h4 className="block-title">TÜMA (Memnuniyet Sıralaması)</h4>
              <div className="grid-auto grid-3">
                {Object.entries(selectedUni.tuma)
                  .filter(([alan]) => alan !== 'genel')
                  .map(([alan, deger]) => (
                    <div key={alan} className="kv-row">
                      <span className="kv-key">{alan}</span>
                      <span className="kv-val">#{deger}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bölüm Listesi */}
      <DepartmentList
        selectedUniKey={selectedUniKey}
        allDepartments={allDepartments}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        toggleCompare={toggleCompare}
        compareList={compareList}
      />
    </div>
  );
}
