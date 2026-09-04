// src/views/QuizView.jsx

import { APP_THEME } from '../constants/theme';

export function QuizView({
  currentIdx,
  result,
  percentageResults,
  handleAnswer,
  resetTest,
  handleUniSelect,
  quizQuestions,
}) {
  const theme = APP_THEME;

  if (result) {
    return (
      <div
        style={{
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          padding: '50px',
          borderRadius: '32px',
          textAlign: 'center',
          border: theme.cardBorder,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
        <h2 style={{ color: theme.textSecondary, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          Test Sonucunuz
        </h2>
        <h1 style={{ color: theme.accentMain, fontSize: '42px', margin: '15px 0 25px', fontWeight: '900' }}>
          {result.name}
        </h1>
        <p style={{ color: theme.textPrimary, fontSize: '18px', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 30px' }}>
          {result.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto 40px', textAlign: 'left' }}>
          {percentageResults.map((item) => (
            <div
              key={item.key}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>
                <span>{item.name}</span>
                <span style={{ color: theme.accentMain }}>%{item.percent}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.percent}%`, height: '100%', background: theme.accentMain, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => handleUniSelect(result.key)}
            style={{
              padding: '16px 36px',
              background: theme.accentMain,
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Üniversiteyi İncele
          </button>
          <button
            onClick={resetTest}
            style={{
              padding: '16px 36px',
              background: 'rgba(255,255,255,0.05)',
              color: theme.textPrimary,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Testi Tekrar Çöz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          background: theme.cardBg,
          backdropFilter: 'blur(20px)',
          padding: '40px 50px',
          borderRadius: '32px',
          border: theme.cardBorder,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ color: theme.accentMain, fontWeight: '800', fontSize: '15px' }}>
            Soru {currentIdx + 1} / {quizQuestions.length}
          </span>
          <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
            %{Math.round(((currentIdx + 1) / quizQuestions.length) * 100)} Tamamlandı
          </span>
        </div>

        <h2 style={{ color: theme.textPrimary, fontSize: '22px', marginBottom: '32px', lineHeight: '1.5' }}>
          {quizQuestions[currentIdx].question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizQuestions[currentIdx].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.scores)}
              style={{
                padding: '20px 24px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                color: theme.textPrimary,
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                lineHeight: '1.5',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
                e.currentTarget.style.borderColor = theme.accentMain;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}