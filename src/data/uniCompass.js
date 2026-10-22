// src/data/uniCompass.js
//
// Üniversitelerin "uyum pusulası" üzerindeki konumları.
// İki eksen (-10 ile +10 arası):
//   X (yatay) : Teknik/Mühendislik (-10)  <-->  Sosyal/Kültürel (+10)
//   Y (dikey) : Girişimci/Sektör (-10)    <-->  Akademik/Araştırma (+10)
//
// Konumlar, uyum testindeki soru temalarına göre elle belirlenmiştir:
// İTÜ -> saf mühendislik/sanayi, Boğaziçi -> sosyal/kültürel, Koç -> girişimci,
// Bilkent/ODTÜ -> akademik/araştırma vb.

export const COMPASS_LABELS = {
  top: 'AKADEMİK / ARAŞTIRMA ODAKLI',
  bottom: 'GİRİŞİMCİ / SEKTÖR ODAKLI',
  left: 'TEKNİK / MÜHENDİSLİK',
  right: 'SOSYAL / KÜLTÜREL',
};

// short: pusula üzerinde görünecek kısa etiket
export const UNI_COMPASS = {
  itu: { x: -9, y: -3, short: 'İTÜ' },
  ytu: { x: -7, y: -1, short: 'YTÜ' },
  odtu: { x: -5, y: 7, short: 'ODTÜ' },
  bilkent: { x: -2, y: 9, short: 'Bilkent' },
  hacettepe: { x: -3, y: 3, short: 'Hacettepe' },
  koc: { x: 0, y: -9, short: 'Koç' },
  sabanci: { x: 3, y: -6, short: 'Sabancı' },
  tobb: { x: -2, y: -6, short: 'TOBB ETÜ' },
  marmara: { x: 6, y: -1, short: 'Marmara' },
  bogazici: { x: 8, y: 3, short: 'Boğaziçi' },
};

// Uyum testindeki yüzdelere göre kullanıcının pusuladaki ağırlıklı konumunu hesaplar.
export const calculateUserPosition = (percentageResults) => {
  if (!percentageResults || percentageResults.length === 0) return null;

  const totalWeight = percentageResults.reduce((sum, item) => sum + item.percent, 0);
  if (totalWeight <= 0) return null;

  const x = percentageResults.reduce(
    (sum, item) => sum + (UNI_COMPASS[item.key]?.x ?? 0) * item.percent,
    0
  ) / totalWeight;

  const y = percentageResults.reduce(
    (sum, item) => sum + (UNI_COMPASS[item.key]?.y ?? 0) * item.percent,
    0
  ) / totalWeight;

  return { x, y };
};
