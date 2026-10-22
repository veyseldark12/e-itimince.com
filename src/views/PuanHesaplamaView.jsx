// src/views/PuanHesaplamaView.jsx

import { useState } from 'react';
import {
  FaChartBar,
  FaFileAlt,
  FaRulerCombined,
  FaBalanceScale,
  FaBookOpen,
  FaGlobeEurope,
  FaGraduationCap,
  FaRocket,
  FaBullseye,
  FaTrophy,
} from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';

// ---------- YKS SORU LİMİTLERİ ----------
const MAX_SORU = {
  TYT: { turkce: 40, sosyal: 20, matematik: 40, fen: 20 },
  AYT: {
    matematik: 40, fizik: 14, kimya: 13, biyoloji: 13,
    edebiyat: 24, tarih1: 10, cografya1: 6,
    tarih2: 11, cografya2: 11, felsefe: 12, din: 6, dil: 80
  }
};

// ---------- 1. ÖSYM 2026 HAM SINAV PUANLARI YIĞINSAL DAĞILIMI (GÖRSEL 1) ----------
const HAM_YIGINSAL_2026 = {
  TYT: [
    { puan: 500, siralama: 5 }, { puan: 480, siralama: 822 }, { puan: 460, siralama: 5524 },
    { puan: 440, siralama: 17050 }, { puan: 420, siralama: 37770 }, { puan: 400, siralama: 67394 },
    { puan: 380, siralama: 106404 }, { puan: 360, siralama: 155008 }, { puan: 340, siralama: 218156 },
    { puan: 320, siralama: 302758 }, { puan: 300, siralama: 417935 }, { puan: 280, siralama: 577094 },
    { puan: 260, siralama: 787244 }, { puan: 240, siralama: 1045340 }, { puan: 220, siralama: 1332391 },
    { puan: 200, siralama: 1630698 }, { puan: 180, siralama: 1914717 }, { puan: 160, siralama: 2125244 },
    { puan: 140, siralama: 2184873 }, { puan: 120, siralama: 2187723 }, { puan: 100, siralama: 2187743 }
  ],
  SAY: [
    { puan: 500, siralama: 1 }, { puan: 480, siralama: 1453 }, { puan: 460, siralama: 8786 },
    { puan: 440, siralama: 22370 }, { puan: 420, siralama: 39624 }, { puan: 400, siralama: 58728 },
    { puan: 380, siralama: 78806 }, { puan: 360, siralama: 100553 }, { puan: 340, siralama: 125045 },
    { puan: 320, siralama: 153304 }, { puan: 300, siralama: 187034 }, { puan: 280, siralama: 228643 },
    { puan: 260, siralama: 279885 }, { puan: 240, siralama: 344536 }, { puan: 220, siralama: 430074 },
    { puan: 200, siralama: 549793 }, { puan: 180, siralama: 721488 }, { puan: 160, siralama: 923753 },
    { puan: 140, siralama: 1078515 }, { puan: 120, siralama: 1134006 }, { puan: 100, siralama: 1135718 }
  ],
  EA: [
    { puan: 500, siralama: 1 }, { puan: 480, siralama: 52 }, { puan: 460, siralama: 307 },
    { puan: 440, siralama: 874 }, { puan: 420, siralama: 2097 }, { puan: 400, siralama: 4545 },
    { puan: 380, siralama: 9486 }, { puan: 360, siralama: 23452 }, { puan: 340, siralama: 50608 },
    { puan: 320, siralama: 89520 }, { puan: 300, siralama: 140784 }, { puan: 280, siralama: 210499 },
    { puan: 260, siralama: 308127 }, { puan: 240, siralama: 440752 }, { puan: 220, siralama: 615366 },
    { puan: 200, siralama: 832251 }, { puan: 180, siralama: 1069239 }, { puan: 160, siralama: 1272506 },
    { puan: 140, siralama: 1391240 }, { puan: 120, siralama: 1420558 }, { puan: 100, siralama: 1421290 }
  ],
  SOZ: [
    { puan: 500, siralama: 1 }, { puan: 480, siralama: 10 }, { puan: 460, siralama: 74 },
    { puan: 440, siralama: 214 }, { puan: 420, siralama: 560 }, { puan: 400, siralama: 1418 },
    { puan: 380, siralama: 3936 }, { puan: 360, siralama: 10259 }, { puan: 340, siralama: 23653 },
    { puan: 320, siralama: 47292 }, { puan: 300, siralama: 86560 }, { puan: 280, siralama: 148959 },
    { puan: 260, siralama: 238848 }, { puan: 240, siralama: 360487 }, { puan: 220, siralama: 515916 },
    { puan: 200, siralama: 699304 }, { puan: 180, siralama: 873860 }, { puan: 160, siralama: 998826 },
    { puan: 140, siralama: 1065157 }, { puan: 120, siralama: 1084720 }, { puan: 100, siralama: 1085698 }
  ],
  DIL: [
    { puan: 500, siralama: 5 }, { puan: 480, siralama: 118 }, { puan: 460, siralama: 628 },
    { puan: 440, siralama: 1795 }, { puan: 420, siralama: 3632 }, { puan: 400, siralama: 6683 },
    { puan: 380, siralama: 11576 }, { puan: 360, siralama: 18265 }, { puan: 340, siralama: 26469 },
    { puan: 320, siralama: 35020 }, { puan: 300, siralama: 43883 }, { puan: 280, siralama: 52590 },
    { puan: 260, siralama: 61992 }, { puan: 240, siralama: 72025 }, { puan: 220, siralama: 82982 },
    { puan: 200, siralama: 94735 }, { puan: 180, siralama: 107579 }, { puan: 160, siralama: 120099 },
    { puan: 140, siralama: 128950 }, { puan: 120, siralama: 132443 }, { puan: 100, siralama: 132826 }
  ]
};

// ---------- 2. ÖSYM 2026 YERLEŞTİRME PUANLARI YIĞINSAL DAĞILIMI (GÖRSEL 2) ----------
const YERLESTIRME_YIGINSAL_2026 = {
  TYT: [
    { puan: 550, siralama: 112 }, { puan: 530, siralama: 2045 }, { puan: 510, siralama: 8638 },
    { puan: 490, siralama: 22600 }, { puan: 470, siralama: 45313 }, { puan: 450, siralama: 76021 },
    { puan: 430, siralama: 115071 }, { puan: 410, siralama: 163211 }, { puan: 390, siralama: 225038 },
    { puan: 370, siralama: 305570 }, { puan: 350, siralama: 412011 }, { puan: 330, siralama: 553526 },
    { puan: 310, siralama: 735519 }, { puan: 290, siralama: 961261 }, { puan: 270, siralama: 1219171 },
    { puan: 250, siralama: 1499060 }, { puan: 230, siralama: 1782951 }, { puan: 210, siralama: 2033331 },
    { puan: 190, siralama: 2166477 }, { puan: 170, siralama: 2186977 }, { puan: 150, siralama: 2187734 },
    { puan: 130, siralama: 2187742 }, { puan: 115, siralama: 2187743 }
  ],
  SAY: [
    { puan: 550, siralama: 154 }, { puan: 530, siralama: 3500 }, { puan: 510, siralama: 12887 },
    { puan: 490, siralama: 27402 }, { puan: 470, siralama: 44919 }, { puan: 450, siralama: 63669 },
    { puan: 430, siralama: 83511 }, { puan: 410, siralama: 105112 }, { puan: 390, siralama: 129485 },
    { puan: 370, siralama: 157778 }, { puan: 350, siralama: 191247 }, { puan: 330, siralama: 232317 },
    { puan: 310, siralama: 282213 }, { puan: 290, siralama: 344726 }, { puan: 270, siralama: 425443 },
    { puan: 250, siralama: 533920 }, { puan: 230, siralama: 681176 }, { puan: 210, siralama: 858167 },
    { puan: 190, siralama: 1019046 }, { puan: 170, siralama: 1117304 }, { puan: 150, siralama: 1135198 },
    { puan: 130, siralama: 1135713 }, { puan: 115, siralama: 1135718 }
  ],
  EA: [
    { puan: 550, siralama: 12 }, { puan: 530, siralama: 98 }, { puan: 510, siralama: 394 },
    { puan: 490, siralama: 1118 }, { puan: 470, siralama: 2482 }, { puan: 450, siralama: 5299 },
    { puan: 430, siralama: 12363 }, { puan: 410, siralama: 29700 }, { puan: 390, siralama: 58772 },
    { puan: 370, siralama: 97839 }, { puan: 350, siralama: 148570 }, { puan: 330, siralama: 215631 },
    { puan: 310, siralama: 307918 }, { puan: 290, siralama: 429479 }, { puan: 270, siralama: 585271 },
    { puan: 250, siralama: 775922 }, { puan: 230, siralama: 990764 }, { puan: 210, siralama: 1196809 },
    { puan: 190, siralama: 1347025 }, { puan: 170, siralama: 1412649 }, { puan: 150, siralama: 1421093 },
    { puan: 130, siralama: 1421289 }, { puan: 115, siralama: 1421290 }
  ],
  SOZ: [
    { puan: 550, siralama: 4 }, { puan: 530, siralama: 14 }, { puan: 510, siralama: 69 },
    { puan: 490, siralama: 221 }, { puan: 470, siralama: 606 }, { puan: 450, siralama: 1566 },
    { puan: 430, siralama: 4058 }, { puan: 410, siralama: 10184 }, { puan: 390, siralama: 22750 },
    { puan: 370, siralama: 45237 }, { puan: 350, siralama: 82479 }, { puan: 330, siralama: 140496 },
    { puan: 310, siralama: 223004 }, { puan: 290, siralama: 333238 }, { puan: 270, siralama: 474443 },
    { puan: 250, siralama: 642816 }, { puan: 230, siralama: 814264 }, { puan: 210, siralama: 953036 },
    { puan: 190, siralama: 1040347 }, { puan: 170, siralama: 1078859 }, { puan: 150, siralama: 1085505 },
    { puan: 130, siralama: 1085697 }, { puan: 115, siralama: 1085698 }
  ],
  DIL: [
    { puan: 550, siralama: 14 }, { puan: 530, siralama: 231 }, { puan: 510, siralama: 942 },
    { puan: 490, siralama: 2252 }, { puan: 470, siralama: 4241 }, { puan: 450, siralama: 7472 },
    { puan: 430, siralama: 12254 }, { puan: 410, siralama: 18566 }, { puan: 390, siralama: 26352 },
    { puan: 370, siralama: 34585 }, { puan: 350, siralama: 43129 }, { puan: 330, siralama: 51784 },
    { puan: 310, siralama: 60948 }, { puan: 290, siralama: 70670 }, { puan: 270, siralama: 81109 },
    { puan: 250, siralama: 92274 }, { puan: 230, siralama: 104127 }, { puan: 210, siralama: 116152 },
    { puan: 190, siralama: 125789 }, { puan: 170, siralama: 131233 }, { puan: 150, siralama: 132714 },
    { puan: 130, siralama: 132825 }, { puan: 115, siralama: 132826 }
  ]
};

// Hassas Lineer İnterpolasyon ile Sıralama Hesabı
const hesaplaSiralama = (puan, tur, veriTablosu) => {
  const veri = veriTablosu[tur];
  if (!veri || !puan || puan <= 0) return null;

  const enYuksekPuan = veri[0].puan;
  if (puan >= enYuksekPuan) {
    const minSiralama = Math.max(1, Math.round(veri[0].siralama * ((enYuksekPuan + 20 - puan) / 20)));
    return minSiralama.toLocaleString('tr-TR');
  }

  const sonElement = veri[veri.length - 1];
  if (puan <= sonElement.puan) {
    return `>${sonElement.siralama.toLocaleString('tr-TR')}`;
  }

  for (let i = 0; i < veri.length - 1; i++) {
    const ustPuan = veri[i].puan;
    const ustSira = veri[i].siralama;
    const altPuan = veri[i + 1].puan;
    const altSira = veri[i + 1].siralama;

    if (puan <= ustPuan && puan >= altPuan) {
      const oran = (ustPuan - puan) / (ustPuan - altPuan);
      const tahminiSira = Math.round(ustSira + oran * (altSira - ustSira));
      return tahminiSira.toLocaleString('tr-TR');
    }
  }

  return null;
};

// ÖSYM Standart Net Hesabı
const calcNet = (d, y) => {
  const dogru = Number(d) || 0;
  const yanlis = Number(y) || 0;
  return Math.max(0, dogru - (yanlis / 4));
};

// Sonuç tablosunda gösterilen alanlar
const ALANLAR = [
  { key: 'SAY', name: <span className="meta-item"><FaRulerCombined /> SAYISAL</span> },
  { key: 'EA', name: <span className="meta-item"><FaBalanceScale /> EŞİT AĞIRLIK</span> },
  { key: 'SOZ', name: <span className="meta-item"><FaBookOpen /> SÖZEL</span> },
  { key: 'DIL', name: <span className="meta-item"><FaGlobeEurope /> YABANCI DİL</span> },
];

// Input bileşeni
const InputRow = ({ sinav, dersAdi, dersKey, maxSoru, data, handleInputChange }) => {
  const net = calcNet(data.d, data.y);

  return (
    <div className="field">
      <span className="field-label">{dersAdi}</span>
      <span className="field-label">D</span>
      <input
        type="number"
        min="0"
        value={data.d === 0 ? '' : data.d}
        onChange={(e) => handleInputChange(sinav, dersKey, 'd', e.target.value, maxSoru)}
        placeholder="0"
      />
      <span className="field-label">Y</span>
      <input
        type="number"
        min="0"
        value={data.y === 0 ? '' : data.y}
        onChange={(e) => handleInputChange(sinav, dersKey, 'y', e.target.value, maxSoru)}
        placeholder="0"
      />
      <span className="td-strong text-accent">{net.toFixed(2)}</span>
    </div>
  );
};

export function PuanHesaplamaView() {
  const [tyt, setTyt] = useState({
    turkce: { d: 0, y: 0 }, sosyal: { d: 0, y: 0 },
    matematik: { d: 0, y: 0 }, fen: { d: 0, y: 0 }
  });

  const [ayt, setAyt] = useState({
    matematik: { d: 0, y: 0 }, fizik: { d: 0, y: 0 }, kimya: { d: 0, y: 0 }, biyoloji: { d: 0, y: 0 },
    edebiyat: { d: 0, y: 0 }, tarih1: { d: 0, y: 0 }, cografya1: { d: 0, y: 0 },
    tarih2: { d: 0, y: 0 }, cografya2: { d: 0, y: 0 }, felsefe: { d: 0, y: 0 }, din: { d: 0, y: 0 },
    dil: { d: 0, y: 0 }
  });

  const [diplomaNotu, setDiplomaNotu] = useState(75);
  const [sonuc, setSonuc] = useState(null);

  const handleInputChange = (sinav, ders, tip, deger, maxSoru) => {
    let val = parseInt(deger, 10);
    if (isNaN(val) || val < 0) val = 0;
    if (val > maxSoru) val = maxSoru;

    const targetObj = sinav === 'TYT' ? tyt : ayt;
    const current = targetObj[ders];

    const digerTip = tip === 'd' ? 'y' : 'd';
    const digerVal = Number(current[digerTip]) || 0;
    if (val + digerVal > maxSoru) {
      val = maxSoru - digerVal;
    }

    if (sinav === 'TYT') {
      setTyt(prev => ({ ...prev, [ders]: { ...current, [tip]: val } }));
    } else {
      setAyt(prev => ({ ...prev, [ders]: { ...current, [tip]: val } }));
    }
  };

  const hesapla = () => {
    const numDiploma = Number(diplomaNotu) || 0;
    const obpKatkisi = Number((numDiploma * 0.6).toFixed(2));

    const tNet = {
      turkce: calcNet(tyt.turkce.d, tyt.turkce.y),
      sosyal: calcNet(tyt.sosyal.d, tyt.sosyal.y),
      matematik: calcNet(tyt.matematik.d, tyt.matematik.y),
      fen: calcNet(tyt.fen.d, tyt.fen.y),
    };

    const aNet = {};
    Object.keys(ayt).forEach(k => {
      aNet[k] = calcNet(ayt[k].d, ayt[k].y);
    });

    // TYT Ham Puanı
    const tytPuan = Number((
      100 + 
      (tNet.turkce * 3.3) + 
      (tNet.matematik * 3.3) + 
      (tNet.sosyal * 3.4) + 
      (tNet.fen * 3.4)
    ).toFixed(2));

    // AYT için TYT Katkısı
    const alanTytKatkisi = 
      (tNet.turkce * 1.32) + 
      (tNet.matematik * 1.32) + 
      (tNet.sosyal * 1.36) + 
      (tNet.fen * 1.36);

    const alanTaban = 100 + alanTytKatkisi;

    const sonuclar = {};
    const turler = ['SAY', 'EA', 'SOZ', 'DIL'];

    turler.forEach(tur => {
      let aytKatkisi = 0;
      
      if (tur === 'SAY') {
        aytKatkisi = (aNet.matematik * 3) + (aNet.fizik * 2.85) + (aNet.kimya * 3.07) + (aNet.biyoloji * 3.07);
      } else if (tur === 'EA') {
        aytKatkisi = (aNet.matematik * 3) + (aNet.edebiyat * 3) + (aNet.tarih1 * 2.8) + (aNet.cografya1 * 3.33);
      } else if (tur === 'SOZ') {
        aytKatkisi = (aNet.edebiyat * 3) + (aNet.tarih1 * 2.8) + (aNet.cografya1 * 3.33) + 
                     (aNet.tarih2 * 2.91) + (aNet.cografya2 * 2.91) + (aNet.felsefe * 3) + (aNet.din * 3.33);
      } else if (tur === 'DIL') {
        aytKatkisi = (aNet.dil * 3);
      }

      const hamPuan = Number((alanTaban + aytKatkisi).toFixed(2));
      const yerlesmePuan = Number((hamPuan + obpKatkisi).toFixed(2));

      sonuclar[tur] = {
        hamPuan,
        yerlesmePuan,
        hamSiralama: hesaplaSiralama(hamPuan, tur, HAM_YIGINSAL_2026),
        yerlesmeSiralama: hesaplaSiralama(yerlesmePuan, tur, YERLESTIRME_YIGINSAL_2026)
      };
    });

    const tytYerlesme = Number((tytPuan + obpKatkisi).toFixed(2));

    setSonuc({
      tytPuan,
      tytYerlesmePuan: tytYerlesme,
      tytHamSiralama: hesaplaSiralama(tytPuan, 'TYT', HAM_YIGINSAL_2026),
      tytYerlesmeSiralama: hesaplaSiralama(tytYerlesme, 'TYT', YERLESTIRME_YIGINSAL_2026),
      obp: obpKatkisi,
      alanlar: sonuclar
    });
  };

  return (
    <div>
      <PageHeader
        kicker="ARAÇLAR"
        icon={FaChartBar}
        title="2026 YKS Puan & Sıralama Hesaplama"
        desc="Resmi ÖSYM 2026 Yığılsal Dağılım Tablolarıyla (Ham + Yerleştirme) Hesaplar."
      />

      <div className="panel mb-24">
        <h4 className="panel-title"><FaFileAlt /> TYT <span className="text-faint text-sm">(Temel Yeterlilik)</span></h4>
        <div className="grid-auto grid-3">
          <InputRow sinav="TYT" dersAdi="Türkçe" dersKey="turkce" maxSoru={MAX_SORU.TYT.turkce} data={tyt.turkce} handleInputChange={handleInputChange} />
          <InputRow sinav="TYT" dersAdi="Sosyal Bilimler" dersKey="sosyal" maxSoru={MAX_SORU.TYT.sosyal} data={tyt.sosyal} handleInputChange={handleInputChange} />
          <InputRow sinav="TYT" dersAdi="Matematik" dersKey="matematik" maxSoru={MAX_SORU.TYT.matematik} data={tyt.matematik} handleInputChange={handleInputChange} />
          <InputRow sinav="TYT" dersAdi="Fen Bilimleri" dersKey="fen" maxSoru={MAX_SORU.TYT.fen} data={tyt.fen} handleInputChange={handleInputChange} />
        </div>
      </div>

      <div className="panel mb-24">
        <h4 className="panel-title"><FaRulerCombined /> SAY / EA <span className="text-faint text-sm">(Ortak Alanlar)</span></h4>
        <div className="grid-auto grid-3">
          <InputRow sinav="AYT" dersAdi="Matematik" dersKey="matematik" maxSoru={MAX_SORU.AYT.matematik} data={ayt.matematik} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Fizik" dersKey="fizik" maxSoru={MAX_SORU.AYT.fizik} data={ayt.fizik} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Kimya" dersKey="kimya" maxSoru={MAX_SORU.AYT.kimya} data={ayt.kimya} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Biyoloji" dersKey="biyoloji" maxSoru={MAX_SORU.AYT.biyoloji} data={ayt.biyoloji} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Edebiyat" dersKey="edebiyat" maxSoru={MAX_SORU.AYT.edebiyat} data={ayt.edebiyat} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Tarih - 1" dersKey="tarih1" maxSoru={MAX_SORU.AYT.tarih1} data={ayt.tarih1} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Coğrafya - 1" dersKey="cografya1" maxSoru={MAX_SORU.AYT.cografya1} data={ayt.cografya1} handleInputChange={handleInputChange} />
        </div>
      </div>

      <div className="panel mb-24">
        <h4 className="panel-title"><FaBookOpen /> SÖZ / DİL <span className="text-faint text-sm">(Sosyal 2 & Dil)</span></h4>
        <div className="grid-auto grid-3">
          <InputRow sinav="AYT" dersAdi="Tarih - 2" dersKey="tarih2" maxSoru={MAX_SORU.AYT.tarih2} data={ayt.tarih2} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Coğrafya - 2" dersKey="cografya2" maxSoru={MAX_SORU.AYT.cografya2} data={ayt.cografya2} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Felsefe Grubu" dersKey="felsefe" maxSoru={MAX_SORU.AYT.felsefe} data={ayt.felsefe} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Din Kültürü" dersKey="din" maxSoru={MAX_SORU.AYT.din} data={ayt.din} handleInputChange={handleInputChange} />
          <InputRow sinav="AYT" dersAdi="Yabancı Dil (YDT)" dersKey="dil" maxSoru={MAX_SORU.AYT.dil} data={ayt.dil} handleInputChange={handleInputChange} />
        </div>
      </div>

      <div className="panel mb-24 flex flex-wrap">
        <div className="field">
          <label className="field-label"><span className="meta-item"><FaGraduationCap /> Diploma Notu (50-100)</span></label>
          <input
            type="number"
            value={diplomaNotu}
            onChange={(e) => setDiplomaNotu(e.target.value)}
            min="50"
            max="100"
          />
        </div>
        <button className="btn btn-primary" onClick={hesapla}>
          <FaRocket /> Puanları & Sıralamayı Hesapla
        </button>
      </div>

      {sonuc ? (
        <div className="animate-up">
          <div className="note note-accent mb-24">
            <span className="meta-item"><FaBullseye /> OBP Katkısı:</span> <strong>+{sonuc.obp} Puan</strong> (ÖSYM 2026 Verileri)
          </div>

          <div className="metric-strip mb-24">
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaFileAlt /> TYT Puanı</span></div>
              <div className="stat-value">{sonuc.tytPuan}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaBullseye /> TYT Yerleştirme</span></div>
              <div className="stat-value">{sonuc.tytYerlesmePuan}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaTrophy /> TYT Sıralama</span></div>
              <div className="stat-value">~{sonuc.tytYerlesmeSiralama || '-'}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-label"><span className="meta-item"><FaGraduationCap /> OBP Katkısı</span></div>
              <div className="stat-value">+{sonuc.obp}</div>
            </div>
          </div>

          <div className="dtable-wrap">
            <div className="dtable-scroll">
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Alan</th>
                    <th className="center">Ham Puan</th>
                    <th className="center">Ham Sıralama</th>
                    <th className="center">Yerleştirme Puanı</th>
                    <th className="center">Yerleştirme Sıralaması</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-strong"><span className="meta-item"><FaFileAlt /> TYT (2 Yıllık)</span></td>
                    <td className="center">{sonuc.tytPuan}</td>
                    <td className="center">~{sonuc.tytHamSiralama}</td>
                    <td className="center td-strong text-accent">{sonuc.tytYerlesmePuan}</td>
                    <td className="center td-strong">~{sonuc.tytYerlesmeSiralama || '-'}</td>
                  </tr>
                  {ALANLAR.map((tur) => (
                    <tr key={tur.key}>
                      <td className="td-strong">{tur.name}</td>
                      <td className="center">{sonuc.alanlar[tur.key].hamPuan}</td>
                      <td className="center">~{sonuc.alanlar[tur.key].hamSiralama}</td>
                      <td className="center td-strong text-accent">{sonuc.alanlar[tur.key].yerlesmePuan}</td>
                      <td className="center td-strong">~{sonuc.alanlar[tur.key].yerlesmeSiralama || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FaChartBar /></div>
          <h3 className="empty-title">Sonuç bekleniyor</h3>
          <p>Doğru ve yanlış sayılarınızı girip hesaplama yapın.</p>
        </div>
      )}
    </div>
  );
}
