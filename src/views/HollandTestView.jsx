// src/views/HollandTestView.jsx

import { useState, useEffect } from 'react';
import {
  FaWrench,
  FaFlask,
  FaPalette,
  FaHandshake,
  FaBriefcase,
  FaClipboardList,
  FaBullseye,
  FaAward,
  FaRedo,
  FaClock,
  FaTimesCircle,
  FaQuestionCircle,
  FaCheckCircle,
  FaCheckDouble,
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { PageHeader } from '../components/PageHeader';

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
  R: { name: 'Gerçekçi', color: '#ef4444', icon: FaWrench },
  I: { name: 'Araştırmacı', color: '#3b82f6', icon: FaFlask },
  A: { name: 'Sanatsal', color: '#8b5cf6', icon: FaPalette },
  S: { name: 'Sosyal', color: '#10b981', icon: FaHandshake },
  E: { name: 'Girişimci', color: '#f59e0b', icon: FaBriefcase },
  C: { name: 'Geleneksel', color: '#6b7280', icon: FaClipboardList },
};

export function HollandTestView() {
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

        const { data } = await supabase
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
      console.error('Kayıt hatası:', error);
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
      <div className="empty-state">
        <div className="empty-title">
          {calculating ? 'Sonuçlar hesaplanıyor ve kaydediliyor...' : 'Yükleniyor...'}
        </div>
      </div>
    );
  }

  if (result) {
    const { scores, top3, careers } = result;
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    return (
      <div className="animate-up">
        <PageHeader
          icon={FaBullseye}
          kicker="Holland Testi"
          title="Holland Testi Sonucu"
          desc="Mesleki ilgi alanların ve sana uygun meslekler."
        />

        <div className="panel panel-lg mb-24">
          <div className="empty-icon">
            <FaAward />
          </div>
          <h3 className="block-title">
            En baskın kişilik tipin:{' '}
            <span style={{ color: TYPE_LABELS[top3[0]]?.color || 'var(--text)' }}>{top3[0]}</span>
          </h3>

          <div className="grid-auto grid-2 mb-24">
            {top3.map((type) => {
              const Icon = TYPE_LABELS[type]?.icon;
              return (
                <div key={type} className="stat-tile">
                  <div className="stat-label">
                    {Icon && <Icon />} {TYPE_LABELS[type]?.name}
                  </div>
                  <div className="stat-value" style={{ color: TYPE_LABELS[type]?.color }}>{type}</div>
                </div>
              );
            })}
          </div>

          <h4 className="block-title">Puanların</h4>
          <div className="grid-auto mb-24">
            {sortedScores.map(([type, score]) => {
              const maxScore = 25; // 5 soru * 5 puan
              const pct = Math.min((score / maxScore) * 100, 100);
              const Icon = TYPE_LABELS[type]?.icon;
              return (
                <div key={type}>
                  <div className="flex-between text-sm text-muted">
                    <span>
                      {Icon && <Icon />} {TYPE_LABELS[type]?.name}
                    </span>
                    <span>{score} Puan</span>
                  </div>
                  <div className="progress mt-8">
                    <span style={{ width: `${pct}%`, background: TYPE_LABELS[type]?.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h4 className="block-title">
            <FaBriefcase /> Önerilen Meslekler
          </h4>
          <div className="flex-wrap">
            {careers.map((job, i) => (
              <span key={i} className="tag">{job}</span>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={resetTest}>
          <FaRedo /> Testi Tekrar Çöz
        </button>
      </div>
    );
  }

  const q = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div className="animate-up">
      <PageHeader
        icon={FaBullseye}
        kicker="Holland Testi"
        title="Holland Kariyer Testi"
        desc="Aşağıdaki ifadelere ne kadar katıldığını 1'den 5'e kadar puanla."
        actions={(
          <span className="tag">
            <FaClock /> {QUESTIONS.length} soru • Yaklaşık 3 dakika
          </span>
        )}
      />

      <div className="mb-16">
        <div className="flex-between text-sm text-muted">
          <span>Soru {currentQuestion + 1}/{QUESTIONS.length}</span>
          <span>%{Math.round(progress)}</span>
        </div>
        <div className="progress mt-8">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="panel panel-lg">
        <h3 className="block-title">{q.text}</h3>

        <div className="grid-auto mt-16">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              className={`btn ${answers[q.id] === val ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleAnswer(val)}
            >
              {val === 1 && (
                <>
                  <FaTimesCircle /> Hiç katılmıyorum
                </>
              )}
              {val === 2 && (
                <>
                  <FaTimesCircle /> Katılmıyorum
                </>
              )}
              {val === 3 && (
                <>
                  <FaQuestionCircle /> Kararsızım
                </>
              )}
              {val === 4 && (
                <>
                  <FaCheckCircle /> Katılıyorum
                </>
              )}
              {val === 5 && (
                <>
                  <FaCheckDouble /> Tamamen katılıyorum
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
