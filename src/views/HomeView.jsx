// src/views/HomeView.jsx

import { StatCard } from '../components/StatCard';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';

export function HomeView({ setActiveTab, resetTest, handleUniSelect, allDepartments }) {
  const theme = APP_THEME;

  // İstatistikler
  const totalUni = Object.keys(uniDatabase).length;
  const totalDepts = allDepartments.length;

  // En iyi QS üniversitesi
  const bestQS = Object.values(uniDatabase)
    .filter(u => u.qs)
    .sort((a, b) => a.qs - b.qs)[0];

  // En iyi TÜMA üniversitesi
  const bestTUMA = Object.values(uniDatabase)
    .filter(u => u.tuma?.genel)
    .sort((a, b) => a.tuma.genel - b.tuma.genel)[0];

  // Yüksek istihdamlı bölüm sayısı
  const highEmployment = allDepartments.filter(d => {
    const name = d.name?.toLowerCase() || '';
    return name.includes('mühendis') || 
           name.includes('tıp') || 
           name.includes('hemşire') ||
           name.includes('eczacı') ||
           name.includes('diş');
  }).length;

  return (
    <div>
      {/* ===== HERO - TAM ORTALI ===== */}
      <div
        style={{
          borderRadius: '24px',
          padding: '64px 40px',
          background: theme.cardBg,
          border: theme.cardBorder,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)',
          marginBottom: '48px',
          textAlign: 'center',
        }}
      >
        {/* Başlık - Ortalı */}
        <div>
          <div
            style={{
              fontSize: '44px',
              fontWeight: '900',
              color: theme.textPrimary,
              letterSpacing: '-0.5px',
            }}
          >
            eğitimince<span style={{ color: theme.accentMain }}>.com</span>
          </div>
          <div
            style={{
              fontSize: '18px',
              color: theme.accentMain,
              fontWeight: '600',
              letterSpacing: '1px',
              marginTop: '2px',
            }}
          >
            2027 Güncel Veriler
          </div>
        </div>

        {/* Açıklama - Ortalı */}
        <p
          style={{
            fontSize: '17px',
            color: theme.textSecondary,
            maxWidth: '560px',
            margin: '16px auto 28px auto',
            lineHeight: '1.8',
            textAlign: 'center',
          }}
        >
          QS, TÜMA ve istihdam verileriyle üniversite tercihini 
          <span style={{ color: theme.textPrimary, fontWeight: '600' }}> en doğru</span> şekilde yap.
        </p>

        {/* Butonlar - Ortalı */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setActiveTab('test');
              resetTest();
            }}
            style={{
              padding: '14px 38px',
              background: theme.accentMain,
              color: '#fff',
              border: 'none',
              borderRadius: '40px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${theme.accentMain}35`,
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${theme.accentMain}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accentMain}35`;
            }}
          >
            🎯 Uyum Testine Başla
          </button>
          <button
            onClick={() => handleUniSelect('all')}
            style={{
              padding: '14px 38px',
              background: 'transparent',
              color: theme.textPrimary,
              border: `2px solid ${theme.accentMain}`,
              borderRadius: '40px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.accentMain;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.textPrimary;
            }}
          >
            📚 Tüm Bölümleri İncele
          </button>
        </div>
      </div>

      {/* ===== İSTATİSTİKLER ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}
      >
        <StatCard
          title="Üniversite"
          value={totalUni}
          icon="🏛️"
          color={theme.accentMain}
        />
        <StatCard
          title="Bölüm"
          value={totalDepts}
          icon="📚"
          color={theme.accentCyan}
        />
        <StatCard
          title="Yüksek İstihdam"
          value={highEmployment}
          icon="💼"
          color="#8b5cf6"
        />
      </div>

      {/* ===== ÖNE ÇIKANLAR ===== */}
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '800',
            marginBottom: '20px',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          ⭐ Öne Çıkan Üniversiteler
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {bestQS && (
            <div
              style={{
                background: theme.cardBg,
                padding: '18px 24px',
                borderRadius: '16px',
                border: `2px solid ${theme.accentMain}25`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '30px' }}>🌍</span>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>En İyi QS Sıralaması</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: theme.textPrimary }}>
                  {bestQS.name}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0ea5e9' }}>
                  #{bestQS.qs} Dünya
                </div>
              </div>
            </div>
          )}

          {bestTUMA && (
            <div
              style={{
                background: theme.cardBg,
                padding: '18px 24px',
                borderRadius: '16px',
                border: `2px solid #8b5cf625`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '30px' }}>🏆</span>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary }}>En İyi TÜMA Memnuniyet</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: theme.textPrimary }}>
                  {bestTUMA.name}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#8b5cf6' }}>
                  #{bestTUMA.tuma.genel}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== POPÜLER BÖLÜMLER ===== */}
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '800',
            marginBottom: '6px',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          🔥 Popüler Bölümler
        </h2>
        <p style={{ color: theme.textSecondary, marginBottom: '18px', fontSize: '14px', textAlign: 'center' }}>
          2027 YKS'de en çok tercih edilen bölümler
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { name: 'Bilgisayar Mühendisliği', icon: '💻' },
            { name: 'Tıp', icon: '🏥' },
            { name: 'Makine Mühendisliği', icon: '⚙️' },
            { name: 'Hukuk', icon: '⚖️' },
            { name: 'Psikoloji', icon: '🧠' },
            { name: 'Mimarlık', icon: '🏛️' },
          ].map((dept, idx) => (
            <div
              key={idx}
              style={{
                background: theme.cardBg,
                padding: '14px 18px',
                borderRadius: '14px',
                border: theme.cardBorder,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                justifyContent: 'center',
              }}
              onClick={() => handleUniSelect('all')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '26px' }}>{dept.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                {dept.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== NASIL ÇALIŞIR? ===== */}
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '24px',
            color: theme.textPrimary,
          }}
        >
          🚀 4 Adımda Geleceğini Planla
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            { 
              icon: '🔍', 
              title: 'Keşfet', 
              desc: 'Türkiye\'deki tüm üniversiteleri ve binlerce bölümü detaylıca incele.' 
            },
            { 
              icon: '📋', 
              title: 'Karşılaştır', 
              desc: 'Bölümleri yan yana kıyasla, QS, TÜMA ve istihdam verilerini gör.' 
            },
            { 
              icon: '❤️', 
              title: 'Favorile', 
              desc: 'Beğendiğin bölümleri tercih listene ekle, kolayca takip et.' 
            },
            { 
              icon: '📈', 
              title: 'Simüle Et', 
              desc: 'Sıralamana göre olası yerleşme durumunu gör, stratejik tercih yap.' 
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: theme.cardBg,
                padding: '24px 20px',
                borderRadius: '16px',
                border: theme.cardBorder,
                textAlign: 'center',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '38px', marginBottom: '10px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 6px', color: theme.textPrimary }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0, lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== VERİ KAYNAKLARI ===== */}
      <div
        style={{
          background: theme.cardBg,
          padding: '32px 28px',
          borderRadius: '20px',
          border: theme.cardBorder,
          marginBottom: '48px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '800',
            marginBottom: '4px',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          📊 Güvendiğimiz Veri Kaynakları
        </h2>
        <p style={{ color: theme.textSecondary, textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          2027 güncel verileri ile en doğru kararı verin.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { icon: '🌍', label: 'QS Dünya Sıralamaları', desc: 'Akademik performans' },
            { icon: '🏆', label: 'TÜMA Memnuniyet', desc: 'Öğrenci memnuniyeti' },
            { icon: '💼', label: 'TÜİK İstihdam', desc: 'Mezun istihdam oranları' },
            { icon: '📈', label: 'YÖK Atlas', desc: 'Taban puan & sıralama' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '2px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                {item.label}
              </div>
              <div style={{ fontSize: '12px', color: theme.textSecondary }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== NEDEN EĞİTİMİNCE? ===== */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.accentMain}08, ${theme.accentHover}05)`,
          padding: '36px 32px',
          borderRadius: '20px',
          border: `1px solid ${theme.accentMain}20`,
          textAlign: 'center',
          marginBottom: '48px',
        }}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '800',
            marginBottom: '10px',
            color: theme.textPrimary,
          }}
        >
          Neden <span style={{ color: theme.accentMain }}>eğitimince.com</span>?
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: theme.textSecondary,
            maxWidth: '520px',
            margin: '0 auto 24px',
            lineHeight: '1.7',
            textAlign: 'center',
          }}
        >
          2027 güncel veriler, kapsamlı içerik ve kişiselleştirilmiş deneyim ile
          kariyer yolculuğunda yanındayız.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
          }}
        >
          {[
            { icon: '📅', label: 'Güncel 2027' },
            { icon: '🧠', label: 'Akıllı Asistan' },
            { icon: '🔒', label: 'Güvenli' },
            { icon: '📱', label: 'Mobil Uyumlu' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '2px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CTA - TAM ORTALI ===== */}
      <div
        style={{
          textAlign: 'center',
          padding: '48px 40px',
          background: `linear-gradient(135deg, ${theme.accentMain}, ${theme.accentHover})`,
          borderRadius: '24px',
          color: '#fff',
        }}
      >
        <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
          🚀 Geleceğini Şimdi Keşfet
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '480px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          Binlerce bölüm arasında sana en uygun olanı bul.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleUniSelect('all')}
            style={{
              padding: '14px 38px',
              background: '#fff',
              color: theme.accentMain,
              border: 'none',
              borderRadius: '40px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
          >
            📚 Bölümleri İncele
          </button>
          <button
            onClick={() => {
              setActiveTab('test');
              resetTest();
            }}
            style={{
              padding: '14px 38px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '40px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            }}
          >
            🎯 Uyum Testine Başla
          </button>
        </div>
      </div>
    </div>
  );
}