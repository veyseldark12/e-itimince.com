// src/views/UniversitiesView.jsx

import { useState } from 'react';
import { DepartmentList } from '../components/DepartmentList';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';

export function UniversitiesView({
  selectedUniKey,
  setSelectedUniKey,
  allDepartments,
  favorites,
  toggleFavorite,
  toggleCompare,
  compareList,
}) {
  const theme = APP_THEME;
  const [hoveredUni, setHoveredUni] = useState(null);

  const selectedUni = selectedUniKey !== 'all' ? uniDatabase[selectedUniKey] : null;

  // Tüm Üniversiteler Görünümü
  if (selectedUniKey === 'all') {
    return (
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          🏛️ Tüm Üniversiteler
        </h2>
        <p style={{ color: theme.textSecondary, fontSize: '16px', marginBottom: '32px' }}>
          Aşağıdaki üniversitelerden birini seçerek bölümlerini inceleyebilirsiniz.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {Object.values(uniDatabase).map((uni) => (
            <div
              key={uni.key}
              onClick={() => setSelectedUniKey(uni.key)}
              onMouseEnter={() => setHoveredUni(uni.key)}
              onMouseLeave={() => setHoveredUni(null)}
              style={{
                background: theme.cardBg,
                backdropFilter: 'blur(20px)',
                padding: '28px 24px',
                borderRadius: '20px',
                border: `2px solid ${hoveredUni === uni.key ? uni.color : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: hoveredUni === uni.key ? `0 8px 40px ${uni.color}30` : '0 4px 16px rgba(0,0,0,0.2)',
                transform: hoveredUni === uni.key ? 'translateY(-6px)' : 'translateY(0)',
              }}
            >
              {/* Başlık */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                <div style={{ fontSize: '40px', background: `rgba(255,255,255,0.05)`, border: `2px solid ${uni.color}`, borderRadius: '16px', padding: '10px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {uni.icon}
                </div>
                <div>
                  <h3 style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '800', margin: 0 }}>{uni.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ background: uni.type === 'Vakıf' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)', color: uni.type === 'Vakıf' ? '#f59e0b' : '#06b6d4', padding: '2px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      {uni.type}
                    </span>
                    <span style={{ color: theme.textSecondary, fontSize: '12px' }}>📍 {uni.city}</span>
                    <span style={{ color: theme.textSecondary, fontSize: '12px' }}>🗣️ {uni.lang}</span>
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <p style={{ color: theme.textSecondary, fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                {uni.desc}
              </p>

              {/* 📊 EK VERİLER (Kartta) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                {uni.qs && (
                  <div>
                    <span style={{ color: theme.textSecondary, fontSize: '11px' }}>🌍 QS Dünya</span>
                    <span style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', display: 'block' }}>#{uni.qs}</span>
                  </div>
                )}
                {uni.tuma?.genel && (
                  <div>
                    <span style={{ color: theme.textSecondary, fontSize: '11px' }}>🏆 TÜMA Genel</span>
                    <span style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', display: 'block' }}>#{uni.tuma.genel}</span>
                  </div>
                )}
                {uni.internationalStudents && (
                  <div>
                    <span style={{ color: theme.textSecondary, fontSize: '11px' }}>🌎 Uluslararası Öğrenci</span>
                    <span style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', display: 'block' }}>%{uni.internationalStudents}</span>
                  </div>
                )}
                {uni.totalStudents && (
                  <div>
                    <span style={{ color: theme.textSecondary, fontSize: '11px' }}>🎓 Öğrenci Sayısı</span>
                    <span style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', display: 'block' }}>{uni.totalStudents.toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>

              {/* Alt Bilgi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>
                  📅 Kuruluş: {uni.established}
                  {uni.erasmus && <span style={{ marginLeft: '8px', color: '#10b981' }}>✈️ Erasmus</span>}
                </span>
                <span style={{ color: theme.accentMain, fontSize: '13px', fontWeight: '600' }}>
                  Bölümleri İncele →
                </span>
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
      {/* Geri Butonu */}
      <button
        onClick={() => setSelectedUniKey('all')}
        style={{
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.1)',
          color: theme.textPrimary,
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '32px',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      >
        ← Tüm Üniversitelere Dön
      </button>

      {/* Üniversite Detay Kartı */}
      {selectedUni && (
        <div
          style={{
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            padding: '40px 48px',
            borderRadius: '24px',
            border: theme.cardBorder,
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div
              style={{
                fontSize: '64px',
                background: `rgba(255,255,255,0.05)`,
                border: `2px solid ${selectedUni.color}`,
                borderRadius: '20px',
                padding: '16px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 40px ${selectedUni.color}30`,
              }}
            >
              {selectedUni.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: theme.textPrimary, fontSize: '32px', fontWeight: '900', margin: 0, marginBottom: '6px' }}>
                {selectedUni.name}
              </h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: selectedUni.type === 'Vakıf' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)', color: selectedUni.type === 'Vakıf' ? '#f59e0b' : '#06b6d4', padding: '4px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                  {selectedUni.type}
                </span>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>📍 {selectedUni.city}</span>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>🗣️ {selectedUni.lang}</span>
                <span style={{ color: theme.textSecondary, fontSize: '14px' }}>📅 {selectedUni.established}</span>
              </div>
              <p style={{ color: theme.textSecondary, fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
                {selectedUni.desc}
              </p>
            </div>
          </div>

          {/* Detaylı Ek Veriler */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {selectedUni.qs && (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>🌍 QS Dünya Sıralaması</span>
                <div style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '800' }}>#{selectedUni.qs}</div>
              </div>
            )}
            {selectedUni.tuma?.genel && (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>🏆 TÜMA Genel</span>
                <div style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '800' }}>#{selectedUni.tuma.genel}</div>
              </div>
            )}
            {selectedUni.internationalStudents && (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>🌎 Uluslararası Öğrenci</span>
                <div style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '800' }}>%{selectedUni.internationalStudents}</div>
              </div>
            )}
            {selectedUni.totalStudents && (
              <div>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>🎓 Toplam Öğrenci</span>
                <div style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '800' }}>{selectedUni.totalStudents.toLocaleString('tr-TR')}</div>
              </div>
            )}
            <div>
              <span style={{ color: theme.textSecondary, fontSize: '12px' }}>✈️ Uluslararası Program</span>
              <div style={{ color: selectedUni.erasmus ? '#10b981' : theme.textSecondary, fontSize: '18px', fontWeight: '700' }}>
                {selectedUni.erasmus ? '✅ Erasmus / Değişim' : '❌ Yok'}
              </div>
            </div>
          </div>

          {/* QS Detayları (varsa) */}
          {selectedUni.qsDetails && Object.keys(selectedUni.qsDetails).length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ color: theme.textPrimary, fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>🌍 QS Alan Sıralamaları</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {Object.entries(selectedUni.qsDetails).map(([alan, deger]) => (
                  <div key={alan} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: theme.textSecondary, fontSize: '12px' }}>{alan}</span>
                    <span style={{ color: theme.accentMain, fontSize: '12px', fontWeight: '700' }}>#{deger}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TÜMA Detayları (varsa) */}
          {selectedUni.tuma && Object.keys(selectedUni.tuma).filter(k => k !== 'genel').length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ color: theme.textPrimary, fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>🏆 TÜMA (Memnuniyet Sıralaması)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {Object.entries(selectedUni.tuma)
                  .filter(([alan]) => alan !== 'genel')
                  .map(([alan, deger]) => (
                    <div key={alan} style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>{alan}</span>
                      <span style={{ color: theme.accentMain, fontSize: '12px', fontWeight: '700' }}>#{deger}</span>
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