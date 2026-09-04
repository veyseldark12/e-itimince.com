// src/utils/rankHelpers.js
import { uniDatabase } from '../data/uniDatabase';

export const normalizeText = (text) => {
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

// YENİ KELİME EKLERKEN SADECE BURAYI DÜZENLEYECEKSİN:
// NOT: Spesifik kelimeleri (ör. 'kimya mühendisliği') genel kelimelerin (ör. 'kimya') ÜSTÜNE koymalısın.
export const qsMappings = [
  { keywords: ['bilgisayar', 'yazılım', 'bilişim', 'yapay zeka', 'siber', 'ybs', 'yönetim bilişim', 'adli bilişim', 'oyun tasarımı'], key: 'Bilgisayar Bilimi ve Bilgi Sistemleri' },
  { keywords: ['elektrik', 'elektronik', 'haberleşme', 'otomasyon', 'biyomedikal', 'kontrol'], key: 'Mühendislik - Elektrik ve Elektronik' },
  { keywords: ['makine', 'mekanik', 'mekatronik', 'uçak', 'uzay', 'havacılık', 'gemi', 'otomotiv', 'imalat', 'raylı'], key: 'Mühendislik - Mekanik' },
  { keywords: ['çevre mühendisliği', 'inşaat', 'yapı', 'geomatik', 'harita', 'ulaştırma'], key: 'Mühendislik - İnşaat ve Yapı' },
  { keywords: ['kimya mühendisliği', 'polimer', 'metalürji', 'malzeme', 'biyomühendislik', "kimya"], key: 'Mühendislik - Kimya' },
  { keywords: ['kimya', 'biyokimya'], key: 'Kimya' },
  { keywords: ['mimarlık', 'şehir', 'bölge planlama', 'peyzaj', 'kentsel', 'iç mimar'], key: 'Mimarlık ve Yapılı Çevre' },
  { keywords: ['matematik'], key: 'Matematik' },
  { keywords: ['fizik', 'astronomi', 'uzay bilimleri'], key: 'Fizik ve Astronomi' },
  { keywords: ['biyoloji', 'moleküler biyoloji ve genetik', 'genetik', 'biyo', 'ziraat', 'tarım', 'su ürünleri'], key: 'Biyolojik Bilimler' },
  { keywords: ['istatistik', 'veri bilimi', 'veri analitiği', 'aktüerya'], key: 'Veri Bilimi ve Yapay Zeka' }, 
  { keywords: ['endüstri mühendisliği', 'mühendislik', 'teknoloji', 'enerji', 'maden', 'petrol', 'jeoloji', 'tekstil'], key: 'Mühendislik ve Teknoloji' },
  { keywords: ['iktisat', 'ekonomi', 'ekonometri', 'çalışma ekonomisi', 'maliye', "endüstri"], key: 'Ekonomi ve Ekonometri' },
  { keywords: ['kamu yönetimi', 'siyaset', 'uluslararası ilişkiler', 'yerel yönetimler', 'siyasal'], key: 'Siyaset' }, 
  { keywords: ['işletme', 'yönetim', 'pazarlama', 'lojistik', 'ticaret', 'turizm', 'insan kaynakları', 'muhasebe', 'finans', 'bankacılık', 'sigortacılık', 'girişimcilik'], key: 'İşletme ve Yönetim Çalışmaları' },
  { keywords: ['psikoloji', 'pdr', 'psikolojik'], key: 'Psikoloji' },
  { keywords: ['tarih', 'arkeoloji', 'sanat tarihi', 'kültür'], key: 'Tarih' },
  { keywords: ['hukuk', 'adalet'], key: 'Hukuk ve Hukuk Çalışmaları' },
  { keywords: ['hemşire', 'ebe'], key: 'Hemşirelik' },
  { keywords: ['tıp', 'ilaç', 'cerrahi', 'sağlık yönetimi'], key: 'İlaç' },
  { keywords: ['diş', 'ağız'], key: 'Diş Hekimliği' },
  { keywords: ['eczacılık', 'eczacı', 'farmakoloji'], key: 'Eczacılık ve Farmakoloji' },
  // Dil, İlahiyat ve İletişim gibi QS'te tam spesifik karşılığı bulunmayanlar için genel bir Sosyal yakalama eklenebilir
  { keywords: ['iletişim', 'radyo', 'televizyon', 'gazetecilik', 'medya', 'halkla ilişkiler', 'sosyoloji', 'felsefe', 'edebiyat', 'dilbilim', 'çeviribilim', 'ilahiyat'], key: 'Siyaset' } // veya DB'nizde 'Sosyal Bilimler' alanı varsa oraya yönlendirebilirsiniz
];

export const tumaMappings = [
  // TUMA için genişletilmiş alanlar
  { keywords: ['mühendis', 'bilgisayar', 'elektrik', 'makine', 'inşaat', 'endüstri', 'yazılım', 'uçak', 'uzay', 'gemi', 'mekatronik', 'otomasyon', 'biyomedikal', 'metalürji', 'malzeme', 'harita', 'jeoloji', 'maden', 'enerji', 'tekstil', 'yapay zeka'], key: 'Mühendislik' },
  { keywords: ['tıp', 'diş', 'hemşire', 'eczacılık', 'sağlık', 'fizyoterapi', 'beslenme', 'diyet', 'odyoloji', 'ebe', 'veteriner', 'acil', 'tıbbi', 'gerontoloji', 'ergoterapi', 'perfüzyon', 'dil ve konuşma'], key: 'Tıp ve Sağlık Bilimleri' },
  { keywords: ['hukuk', 'adalet'], key: 'Hukuk' },
  { keywords: ['kamu yönetimi', 'siyaset', 'sosyoloji', 'tarih', 'ilişkiler', 'felsefe', 'coğrafya', 'antropoloji', 'iletişim', 'radyo', 'televizyon', 'gazetecilik', 'medya', 'halkla ilişkiler', 'reklam', 'ilahiyat', 'islam', 'edebiyat', 'dilbilim', 'çeviribilim', 'mütercim', 'rehberlik'], key: 'Sosyal Bilimler' }, 
  { keywords: ['işletme', 'ekonomi', 'iktisat', 'finans', 'muhasebe', 'maliye', 'ekonometri', 'pazarlama', 'lojistik', 'ticaret', 'turizm', 'banka', 'sigorta', 'insan kaynakları', 'yönetim bilişim', 'ybs'], key: 'İşletme ve Ekonomi' },
  { keywords: ['psikoloji', 'pdr'], key: 'Psikoloji' },
  { keywords: ['eğitim', 'öğretmen', 'okul öncesi', 'sınıf öğret', 'özel eğitim'], key: 'Eğitim Bilimleri' },
  { keywords: ['mimarlık', 'tasarım', 'sanat', 'şehir', 'peyzaj', 'grafik', 'animasyon', 'konservatuvar', 'gastronomi', 'mutfak', 'moda', 'iç mimar'], key: 'Sanat, Mimarlık, Tasarım' },
  { keywords: ['fizik', 'kimya', 'biyoloji', 'matematik', 'moleküler', 'genetik', 'istatistik', 'astronomi', 'ziraat', 'tarım', 'su ürünleri', 'orman', 'aktüerya', 'veri bilimi'], key: 'Fen ve Yaşam Bilimleri' },
];

export const getSubjectRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.qsDetails) return null;
  const details = uni.qsDetails;
  const lowerName = normalizeText(deptName);

  for (const mapping of qsMappings) {
    if (mapping.keywords.some((kw) => lowerName.includes(kw))) {
      const rank = details[mapping.key];
      if (rank !== undefined && rank !== null && rank !== '') {
        return rank;
      }
    }
  }
  return null;
};

export const getTumaRank = (deptName, uniKey) => {
  const uni = uniDatabase[uniKey];
  if (!uni || !uni.tuma) return null;
  const details = uni.tuma;
  const lowerName = normalizeText(deptName);

  for (const mapping of tumaMappings) {
    if (mapping.keywords.some((kw) => lowerName.includes(kw))) {
      const rank = details[mapping.key];
      if (rank !== undefined && rank !== null && rank !== '') return rank;
    }
  }
  return details.genel || null;
};