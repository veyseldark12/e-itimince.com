// src/views/HollandTestView.jsx

import { useState, useEffect } from 'react';
import { APP_THEME } from '../constants/theme';
import { supabase } from '../lib/supabaseClient';

const QUESTIONS = [
  { id: 1, text: 'Aletlerle çalışmak ve onarmak hoşuma gider.', type: 'R' },
  { id: 2, text: 'Dışarıda, doğada vakit geçirmeyi severim.', type: 'R' },
  { id: 3, text: 'Mekanik işlerle uğraşmak beni mutlu eder.', type: 'R' },
  { id: 4, text: 'Ellerimi kullanarak çalışmayı severim.', type: 'R' },
  { id: 5, text: 'Teknik çizim veya modelleme yapabilirim.', type: 'R' },
  { id: 6, text: 'Bilimsel deneyler ve araştırmalar ilgimi çeker.', type: 'I' },
  { id: 7, text: 'Karmaşık problemleri çözmekten keyif alırım.', type: 'I' },
  { id: 8, text: 'Yeni şeyler keşfetmeyi ve öğrenmeyi severim.', type: 'I' },
  { id: 9, text: 'Mantıklı ve analitik düşünmeyi tercih ederim.', type: 'I' },
  { id: 10, text: 'Bilim kurgu veya teknoloji konuları ilgimi çeker.', type: 'I' },
  { id: 11, text: 'Resim, müzik veya yazı gibi sanat dallarıyla ilgilenirim.', type: 'A' },
  { id: 12, text: 'Özgün fikirler üretmek hoşuma gider.', type: 'A' },
  { id: 13, text: 'Estetik ve güzellik benim için önemlidir.', type: 'A' },
  { id: 14, text: 'Kendimi ifade etmek için yaratıcı yollar bulurum.', type: 'A' },
  { id: 15, text: 'Sanat eserleri veya tasarımlar üzerinde çalışmaktan keyif alırım.', type: 'A' },
  { id: 16, text: 'Başkalarına yardım etmek beni mutlu eder.', type: 'S' },
  { id: 17, text: 'Öğretmek ve rehberlik etmek hoşuma gider.', type: 'S' },
  { id: 18, text: 'Toplumsal sorunlara duyarlıyımdır.', type: 'S' },
  { id: 19, text: 'İnsanlarla iletişim kurmak benim için kolaydır.', type: 'S' },
  { id: 20, text: 'Gönüllü çalışmalara katılmayı severim.', type: 'S' },
  { id: 21, text: 'Liderlik yapmaktan ve yönlendirmekten hoşlanırım.', type: 'E' },
  { id: 22, text: 'Riski göze alarak yeni işler başlatmayı severim.', type: 'E' },
  { id: 23, text: 'İkna etme ve pazarlama yeteneğim vardır.', type: 'E' },
  { id: 24, text: 'Hedeflere ulaşmak için stratejik düşünürüm.', type: 'E' },
  { id: 25, text: 'Girişimci ruhum vardır, yeni fikirler üretirim.', type: 'E' },
  { id: 26, text: 'Düzenli ve planlı çalışmayı severim.', type: 'C' },
  { id: 27, text: 'Detaylara dikkat ederim.', type: 'C' },
  { id: 28, text: 'Verilerle çalışmak ve raporlamak hoşuma gider.', type: 'C' },
  { id: 29, text: 'Kurallara ve prosedürlere uymak benim için önemlidir.', type: 'C' },
  { id: 30, text: 'Ofis ortamında çalışmayı tercih ederim.', type: 'C' },
];

const CAREER_SUGGESTIONS = {
  R: ['Mühendis', 'Pilot', 'Teknisyen', 'Çiftçi', 'Makine Mühendisi'],
  I: ['Bilim İnsanı', 'Doktor', 'Veri Analisti', 'Yazılım Geliştirici', 'Kimyager'],
  A: ['Ressam', 'Müzisyen', 'Tasarımcı', 'Yazar', 'Mimar'],
  S: ['Öğretmen', 'Psikolog', 'Sosyal Hizmet Uzmanı', 'Hemşire', 'Rehberlik Uzmanı'],
  E: ['Yönetici', 'Girişimci', 'Avukat', 'Pazarlama Uzmanı', 'Satış Temsilcisi'],
  C: ['Muhasebeci', 'Bankacı', 'Büro Yöneticisi', 'Mali Müşavir', 'Denetçi'],
};

const TYPE_LABELS = {
  R: { name: 'Gerçekçi', color: '#ef4444', icon: '🔧' },
  I: { name: 'Araştırmacı', color: '#3b82f6', icon: '🔬' },
  A: { name: 'Sanatsal', color: '#8b5cf6', icon: '🎨' },
  S: { name: 'Sosyal', color: '#10b981', icon: '🤝' },
  E: { name: 'Girişimci', color: '#f59e0b', icon: '💼' },
  C: { name: 'Geleneksel', color: '#6b7280', icon: '📋' },
};

export function HollandTestView() {
  const theme = APP_THEME;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data, error } = await supabase
          .from('student_data')
          .select('holland_result')
          .eq('student_id', user.id)
          .single();

        if (data?.holland_result) {
          setResult(data.holland_result);
        }
      } catch (err) {
        console.error('Kayıt yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, []);

  const handleAnswer = async (value) => {
    const q = QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion + 1 < QUESTIONS.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    setCalculating(true);
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    QUESTIONS.forEach((q) => {
      const val = finalAnswers[q.id] || 0;
      scores[q.type] += val;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3).map(([type]) => type);
    const top1 = top3[0];
    const careers = CAREER_SUGGESTIONS[top1] || [];

    const resultData = { scores, top3, top1, careers };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('student_data')
          .upsert({
            student_id: user.id,
            holland_result: resultData,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'student_id' });
      }
    } catch (error) {
      console.error('❌ Kayıt hatası:', error);
    } finally {
      setResult(resultData);
      setCalculating(false);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (loading || calculating) {
    return (
      <div style={{ color: theme.textSecondary, textAlign: 'center', padding: '60px', fontSize: '18px' }}>
        {calculating ? '🎯 Sonuçlar hesaplanıyor ve kaydediliyor...' : 'Yükleniyor...'}
      </div>
    );
  }

  if (result) {
    const { scores, top3, careers } = result;
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    return (
      <div>
        <h2 style={{ color: theme.accentMain, fontSize: '28px', marginBottom: '8px' }}>
          🎯 Holland Testi Sonucu
        </h2>
        <p style={{ color: theme.textSecondary, marginBottom: '30px' }}>
          Mesleki ilgi alanların ve sana uygun meslekler.
        </p>

        <div style={{ background: theme.cardBg, padding: '32px', borderRadius: '20px', border: theme.cardBorder, marginBottom: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <h3 style={{ color: theme.textPrimary, fontSize: '22px', marginTop: '8px' }}>
              En baskın kişilik tipin: <span style={{ color: TYPE_LABELS[top3[0]]?.color || '#fff' }}>{top3[0]}</span>
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
              {top3.map((type) => (
                <span key={type} style={{ background: `${TYPE_LABELS[type]?.color}20`, color: TYPE_LABELS[type]?.color, padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
                  {TYPE_LABELS[type]?.icon} {TYPE_LABELS[type]?.name}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: theme.textPrimary, fontSize: '16px', marginBottom: '12px' }}>Puanların</h4>
            {sortedScores.map(([type, score]) => {
              const maxScore = 25; // 5 soru * 5 puan
              const pct = Math.min((score / maxScore) * 100, 100);
              return (
                <div key={type} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: theme.textSecondary }}>
                    <span>{TYPE_LABELS[type]?.icon} {TYPE_LABELS[type]?.name}</span>
                    <span>{score} Puan</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: TYPE_LABELS[type]?.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h4 style={{ color: theme.textPrimary, fontSize: '16px', marginBottom: '12px' }}>💼 Önerilen Meslekler</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {careers.map((job, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', color: theme.textSecondary }}>
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button onClick={resetTest} style={{ padding: '14px 40px', background: theme.accentMain, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          🔄 Testi Tekrar Çöz
        </button>
      </div>
    );
  }

  const q = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div>
      <h2 style={{ color: theme.accentMain, fontSize: '28px', marginBottom: '8px' }}>🎯 Holland Kariyer Testi</h2>
      <p style={{ color: theme.textSecondary, marginBottom: '30px' }}>
        Aşağıdaki ifadelere ne kadar katıldığını 1'den 5'e kadar puanla.
        <br />
        <span style={{ fontSize: '13px' }}>⏳ {QUESTIONS.length} soru • Yaklaşık 3 dakika</span>
      </p>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>
          <span>Soru {currentQuestion + 1}/{QUESTIONS.length}</span>
          <span>%{Math.round(progress)}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: theme.accentMain, borderRadius: '4px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ background: theme.cardBg, padding: '32px', borderRadius: '20px', border: theme.cardBorder, marginBottom: '24px' }}>
        <p style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '500', lineHeight: '1.6' }}>{q.text}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleAnswer(val)}
              style={{
                padding: '12px 20px',
                background: answers[q.id] === val ? `${theme.accentMain}20` : 'rgba(255,255,255,0.04)',
                border: answers[q.id] === val ? `2px solid ${theme.accentMain}` : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: theme.textPrimary,
                fontSize: '15px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (answers[q.id] !== val) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (answers[q.id] !== val) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              {val === 1 && '❌ Hiç katılmıyorum'}
              {val === 2 && '❌ Katılmıyorum'}
              {val === 3 && '🤔 Kararsızım'}
              {val === 4 && '✅ Katılıyorum'}
              {val === 5 && '✅✅ Tamamen katılıyorum'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}