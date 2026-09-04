// src/views/CompareView.jsx

import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';

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

const getSubjectRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.qsDetails) return null;
  const lowerName = normalizeText(deptName);

  const mappings = [
    { keywords: ['bilgisayar', 'yazılım', 'bilişim'], key: 'Bilgisayar Bilimi ve Bilgi Sistemleri' },
    { keywords: ['elektrik', 'elektronik', 'haberleşme'], key: 'Mühendislik - Elektrik ve Elektronik' },
    { keywords: ['makine', 'mekanik', 'mekatronik'], key: 'Mühendislik - Mekanik' },
    { keywords: ['inşaat', 'yapı'], key: 'Mühendislik - İnşaat ve Yapı' },
    { keywords: ['kimya mühendisliği'], key: 'Mühendislik - Kimya' },
    { keywords: ['kimya'], key: 'Kimya' },
    { keywords: ['mimarlık', 'şehir'], key: 'Mimarlık ve Yapılı Çevre' },
    { keywords: ['matematik'], key: 'Matematik' },
    { keywords: ['fizik'], key: 'Fizik ve Astronomi' },
    { keywords: ['biyoloji', 'moleküler', 'genetik'], key: 'Biyolojik Bilimler' },
    { keywords: ['istatistik', 'veri bilimi', 'yapay zeka'], key: 'Veri Bilimi ve Yapay Zeka' },
    { keywords: ['istatistik'], key: 'İstatistik ve Yöneylem Araştırması' },
    { keywords: ['endüstri mühendisliği', 'endüstri'], key: 'Mühendislik ve Teknoloji' },
    { keywords: ['iktisat', 'ekonomi'], key: 'Ekonomi ve Ekonometri' },
    { keywords: ['kamu yönetimi', 'siyaset', 'uluslararası ilişkiler'], key: 'Siyaset' },
    { keywords: ['işletme', 'yönetim'], key: 'İşletme ve Yönetim Çalışmaları' },
    { keywords: ['psikoloji', 'pdr'], key: 'Psikoloji' },
    { keywords: ['tarih'], key: 'Tarih' },
    { keywords: ['jeoloji'], key: 'Jeoloji' },
    { keywords: ['çevre'], key: 'Çevre Bilimleri' },
    { keywords: ['maden'], key: 'Maden ve Madencilik' },
    { keywords: ['petrol'], key: 'Mühendislik ve Petrol' },
    { keywords: ['malzeme', 'metalurji'], key: 'Malzeme Bilimleri' },
    { keywords: ['tasarım', 'grafik'], key: 'Sanat ve Tasarım' },
    { keywords: ['eğitim', 'öğretmen'], key: 'Eğitim ve Öğretim' },
    { keywords: ['muhasebe', 'finans'], key: 'Muhasebe ve Finans' },
    { keywords: ['hukuk'], key: 'Hukuk ve Hukuk Çalışmaları' },
    { keywords: ['hemşirelik'], key: 'Hemşirelik' },
    { keywords: ['tıp', 'ilaç'], key: 'İlaç' },
    { keywords: ['diş'], key: 'Diş Hekimliği' },
    { keywords: ['eczacılık'], key: 'Eczacılık ve Farmakoloji' },
  ];

  for (const mapping of mappings) {
    if (mapping.keywords.some(kw => lowerName.includes(kw))) {
      const rank = uni.qsDetails[mapping.key];
      if (rank) return rank;
    }
  }
  return null;
};

const getTumaRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.tuma) return null;
  const lowerName = normalizeText(deptName);

  const mappings = [
    { keywords: ['mühendis', 'bilgisayar', 'elektrik', 'makine', 'inşaat', 'endüstri', 'yazılım'], key: 'Mühendislik' },
    { keywords: ['tıp', 'diş', 'hemşire', 'eczacılık', 'sağlık'], key: 'Tıp ve Sağlık Bilimleri' },
    { keywords: ['hukuk'], key: 'Hukuk' },
    { keywords: ['kamu yönetimi', 'siyaset', 'sosyoloji', 'tarih', 'ilişkiler'], key: 'Sosyal Bilimler' },
    { keywords: ['işletme', 'ekonomi', 'iktisat', 'finans', 'muhasebe'], key: 'İşletme ve Ekonomi' },
    { keywords: ['psikoloji'], key: 'Psikoloji' },
    { keywords: ['eğitim', 'öğretmen'], key: 'Eğitim Bilimleri' },
    { keywords: ['mimarlık', 'tasarım', 'sanat'], key: 'Sanat, Mimarlık, Tasarım' },
    { keywords: ['fizik', 'kimya', 'biyoloji', 'matematik', 'moleküler'], key: 'Fen ve Yaşam Bilimleri' },
  ];

  for (const mapping of mappings) {
    if (mapping.keywords.some(kw => lowerName.includes(kw))) {
      const rank = uni.tuma[mapping.key];
      if (rank !== undefined && rank !== null) return rank;
    }
  }
  return uni.tuma.genel || null;
};

export function CompareView({ compareList, setCompareList, toggleCompare }) {
  const theme = APP_THEME;

  return (
    <div>
      <h2 style={{ color: theme.accentMain, fontSize: '28px', marginBottom: '10px' }}>
        🔍 Bölüm Kıyaslama Modülü
      </h2>
      <p style={{ color: theme.textSecondary, marginBottom: '30px' }}>
        Seçtiğiniz en fazla 3 bölümü yan yana kriterleriyle mukayese edin.
      </p>

      {compareList.length === 0 ? (
        <div style={{ background: theme.cardBg, padding: '60px', textAlign: 'center', borderRadius: '24px', border: theme.cardBorder }}>
          <p style={{ color: theme.textSecondary, fontSize: '16px' }}>Henüz kıyaslama listesine bölüm eklemediniz.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(compareList.length, 3)}, 1fr)`, gap: '20px', overflowX: 'auto' }}>
          {compareList.map((dept) => {
            const qsRank = getSubjectRank(dept.name, dept.uniKey);
            const tumaRank = getTumaRank(dept.name, dept.uniKey);

            return (
              <div key={dept.id} style={{ background: theme.cardBg, borderRadius: '20px', padding: '24px', border: theme.cardBorder, position: 'relative' }}>
                <button
                  onClick={() => toggleCompare(dept)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: theme.danger, border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>

                <h3 style={{ color: theme.textPrimary, fontSize: '18px', marginBottom: '4px', paddingRight: '30px' }}>
                  {dept.name}
                </h3>
                <div style={{ color: theme.accentMain, fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>
                  {dept.uniName}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Fakülte</strong>
                    {dept.faculty}
                  </div>
                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Puan Türü & Dil</strong>
                    {dept.type} • {dept.lang}
                  </div>
                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>2025 Başarı Sırası</strong>
                    {dept.rank2025}
                  </div>
                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Kontenjan</strong>
                    {dept.quota}
                  </div>

                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${theme.accentMain}` }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
                      🌍 QS Subject Sıralaması
                    </strong>
                    {qsRank ? (
                      <span style={{ color: theme.accentMain, fontWeight: '700', fontSize: '15px' }}>#{qsRank}</span>
                    ) : (
                      <span style={{ color: theme.textSecondary, fontSize: '13px' }}>–</span>
                    )}
                  </div>

                  <div style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px', borderLeft: `3px solid #8b5cf6` }}>
                    <strong style={{ color: theme.textSecondary, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
                      🏆 TÜMA Sıralaması
                    </strong>
                    {tumaRank ? (
                      <span style={{ color: '#8b5cf6', fontWeight: '700', fontSize: '15px' }}>#{tumaRank}</span>
                    ) : (
                      <span style={{ color: theme.textSecondary, fontSize: '13px' }}>–</span>
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