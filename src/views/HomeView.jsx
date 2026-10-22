// src/views/HomeView.jsx

import {
  FaLaptopCode,
  FaStethoscope,
  FaCogs,
  FaBalanceScale,
  FaBrain,
  FaBuilding,
  FaSearch,
  FaClipboardList,
  FaHeart,
  FaChartLine,
  FaChartBar,
  FaGlobeEurope,
  FaTrophy,
  FaBriefcase,
  FaCalendarAlt,
  FaLock,
  FaMobileAlt,
  FaUniversity,
  FaBookOpen,
  FaBullseye,
  FaStar,
  FaFire,
  FaRocket,
} from 'react-icons/fa';
import { StatCard } from '../components/StatCard';
import { uniDatabase } from '../data/uniDatabase';

const POPULER_BOLUMLER = [
  { name: 'Bilgisayar Mühendisliği', icon: <FaLaptopCode /> },
  { name: 'Tıp', icon: <FaStethoscope /> },
  { name: 'Makine Mühendisliği', icon: <FaCogs /> },
  { name: 'Hukuk', icon: <FaBalanceScale /> },
  { name: 'Psikoloji', icon: <FaBrain /> },
  { name: 'Mimarlık', icon: <FaBuilding /> },
];

const ADIMLAR = [
  {
    icon: <FaSearch />,
    title: 'Keşfet',
    desc: "Türkiye'deki tüm üniversiteleri ve binlerce bölümü detaylıca incele.",
  },
  {
    icon: <FaClipboardList />,
    title: 'Karşılaştır',
    desc: 'Bölümleri yan yana kıyasla, QS, TÜMA ve istihdam verilerini gör.',
  },
  {
    icon: <FaHeart />,
    title: 'Favorile',
    desc: 'Beğendiğin bölümleri tercih listene ekle, kolayca takip et.',
  },
  {
    icon: <FaChartLine />,
    title: 'Simüle Et',
    desc: 'Sıralamana göre olası yerleşme durumunu gör, stratejik tercih yap.',
  },
];

const VERI_KAYNAKLARI = [
  { icon: <FaGlobeEurope />, label: 'QS Dünya Sıralamaları', desc: 'Akademik performans' },
  { icon: <FaTrophy />, label: 'TÜMA Memnuniyet', desc: 'Öğrenci memnuniyeti' },
  { icon: <FaBriefcase />, label: 'TÜİK İstihdam', desc: 'Mezun istihdam oranları' },
  { icon: <FaChartBar />, label: 'YÖK Atlas', desc: 'Taban puan & sıralama' },
];

const NEDEN_EGITIMINCE = [
  { icon: <FaCalendarAlt />, label: 'Güncel 2027' },
  { icon: <FaBrain />, label: 'Akıllı Asistan' },
  { icon: <FaLock />, label: 'Güvenli' },
  { icon: <FaMobileAlt />, label: 'Mobil Uyumlu' },
];

export function HomeView({ setActiveTab, resetTest, handleUniSelect, allDepartments }) {
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

  const startTest = () => {
    setActiveTab('test');
    resetTest();
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero">
        <span className="hero-badge">2027 güncel veriler</span>

        <h1 className="hero-title">
          Tercihini <span className="gradient-text">veriyle</span> yap.
        </h1>

        <p className="hero-sub">
          QS, TÜMA ve istihdam verileriyle üniversite tercihini
          <strong className="text-accent"> en doğru</strong> şekilde planla.
          Sana en uygun bölümü bul, olası yerleşme durumunu gör.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={startTest}>
            <FaBullseye /> Uyum Testine Başla
          </button>
          <button className="btn btn-outline" onClick={() => handleUniSelect('all')}>
            <FaBookOpen /> Tüm Bölümleri İncele
          </button>
        </div>

        <div className="hero-trust">
          <span className="trust-chip"><FaGlobeEurope /> QS Sıralamaları</span>
          <span className="trust-chip"><FaTrophy /> TÜMA Memnuniyet</span>
          <span className="trust-chip"><FaBriefcase /> TÜİK İstihdam</span>
          <span className="trust-chip"><FaChartLine /> YÖK Atlas</span>
        </div>
      </section>

      {/* ===== İSTATİSTİKLER ===== */}
      <div className="grid-auto grid-3 section">
        <StatCard
          title="Üniversite"
          value={totalUni}
          icon={<FaUniversity />}
          color="var(--accent)"
        />
        <StatCard
          title="Bölüm"
          value={totalDepts}
          icon={<FaBookOpen />}
          color="var(--cyan)"
        />
        <StatCard
          title="Yüksek İstihdam"
          value={highEmployment}
          icon={<FaBriefcase />}
          color="var(--violet)"
        />
      </div>

      {/* ===== ÖNE ÇIKANLAR ===== */}
      <section className="section">
        <span className="section-kicker">Öne çıkanlar</span>
        <h2 className="section-heading"><FaStar /> Zirvedeki Üniversiteler</h2>
        <p className="section-desc">
          Akademik performans ve öğrenci memnuniyetinde ilk sıradaki kurumlar.
        </p>

        <div className="grid-auto grid-2">
          {bestQS && (
            <div className="highlight-card" style={{ borderLeftColor: 'var(--cyan)' }}>
              <div className="highlight-icon"><FaGlobeEurope /></div>
              <div>
                <div className="highlight-label">En iyi QS sıralaması</div>
                <div className="highlight-value">{bestQS.name}</div>
                <div className="highlight-meta" style={{ color: 'var(--cyan)' }}>
                  #{bestQS.qs} Dünya
                </div>
              </div>
            </div>
          )}

          {bestTUMA && (
            <div className="highlight-card" style={{ borderLeftColor: 'var(--violet)' }}>
              <div className="highlight-icon"><FaTrophy /></div>
              <div>
                <div className="highlight-label">En iyi TÜMA memnuniyet</div>
                <div className="highlight-value">{bestTUMA.name}</div>
                <div className="highlight-meta" style={{ color: 'var(--violet)' }}>
                  #{bestTUMA.tuma.genel}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== POPÜLER BÖLÜMLER ===== */}
      <section className="section">
        <span className="section-kicker">Popüler</span>
        <h2 className="section-heading"><FaFire /> En Çok Tercih Edilen Bölümler</h2>
        <p className="section-desc">2027 YKS'de en çok tercih edilen bölümler</p>

        <div className="grid-auto grid-4">
          {POPULER_BOLUMLER.map((dept) => (
            <div key={dept.name} className="pop-card" onClick={() => handleUniSelect('all')}>
              <span className="pop-card-icon">{dept.icon}</span>
              <span className="pop-card-name">{dept.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR? ===== */}
      <section className="section">
        <span className="section-kicker">Nasıl çalışır</span>
        <h2 className="section-heading"><FaRocket /> 4 Adımda Geleceğini Planla</h2>
        <p className="section-desc">
          Keşfetmekten karar vermeye kadar tüm süreç tek yerde.
        </p>

        <div className="grid-auto grid-4" style={{ marginTop: '24px' }}>
          {ADIMLAR.map((item, idx) => (
            <div key={item.title} className="step-card">
              <span className="step-num">{idx + 1}</span>
              <div className="step-icon">{item.icon}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VERİ KAYNAKLARI ===== */}
      <section className="card section" style={{ padding: '28px 24px' }}>
        <span className="section-kicker">Şeffaflık</span>
        <h2 className="section-heading"><FaChartBar /> Güvendiğimiz Veri Kaynakları</h2>
        <p className="section-desc">2027 güncel verileri ile en doğru kararı ver.</p>

        <div className="grid-auto grid-4">
          {VERI_KAYNAKLARI.map((item) => (
            <div key={item.label} className="source-card">
              <div className="source-icon">{item.icon}</div>
              <div className="source-label">{item.label}</div>
              <div className="source-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEDEN EĞİTİMİNCE? ===== */}
      <section className="why-panel section">
        <h2 className="section-heading">
          Neden <span className="text-accent">eğitimince.com</span>?
        </h2>
        <p className="section-desc" style={{ marginBottom: '26px' }}>
          2027 güncel veriler, kapsamlı içerik ve kişiselleştirilmiş deneyim ile
          kariyer yolculuğunda yanındayız.
        </p>

        <div className="grid-auto grid-4">
          {NEDEN_EGITIMINCE.map((item) => (
            <div key={item.label} className="why-item">
              <div className="why-item-icon">{item.icon}</div>
              <div className="why-item-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-panel">
        <h2 className="cta-title"><FaRocket /> Geleceğini Şimdi Keşfet</h2>
        <p className="cta-sub">
          Binlerce bölüm arasında sana en uygun olanı bul.
        </p>
        <div className="hero-actions">
          <button className="btn btn-light" onClick={() => handleUniSelect('all')}>
            <FaBookOpen /> Bölümleri İncele
          </button>
          <button className="btn btn-glass" onClick={startTest}>
            <FaBullseye /> Uyum Testine Başla
          </button>
        </div>
      </section>
    </div>
  );
}
