// src/views/QuizView.jsx

import { FaGraduationCap, FaChartBar } from 'react-icons/fa';
import { UniCompass } from '../components/UniCompass';
import { PageHeader } from '../components/PageHeader';

export function QuizView({
  currentIdx,
  result,
  percentageResults,
  handleAnswer,
  resetTest,
  handleUniSelect,
  quizQuestions,
}) {
  if (result) {
    return (
      <div className="animate-up">
        <PageHeader
          icon={FaGraduationCap}
          kicker="Test Sonucunuz"
          title={result.name}
          desc={result.desc}
        />

        <div className="metric-strip mb-24">
          <div className="stat-tile">
            <div className="stat-label">En Uygun Üniversite</div>
            <div className="stat-value">{result.name}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">En Yüksek Uyum</div>
            <div className="stat-value">%{percentageResults[0]?.percent ?? 0}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Değerlendirilen Üniversite</div>
            <div className="stat-value">{percentageResults.length}</div>
          </div>
        </div>

        <div className="panel mb-24">
          <UniCompass percentageResults={percentageResults} topKey={result.key} />
        </div>

        <h3 className="block-title">
          <FaChartBar /> Uyum Tablosu
        </h3>
        <div className="dtable-wrap">
          <div className="dtable-scroll">
            <table className="dtable">
              <thead>
                <tr>
                  <th>Üniversite</th>
                  <th className="center">Uyum Oranı</th>
                </tr>
              </thead>
              <tbody>
                {percentageResults.map((item) => (
                  <tr key={item.key}>
                    <td className="td-strong">{item.name}</td>
                    <td className="center">
                      <span className={`tag ${item.key === result.key ? 'tag-accent' : ''}`}>
                        %{item.percent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-wrap mt-24">
          <button className="btn btn-primary" onClick={() => handleUniSelect(result.key)}>
            Üniversiteyi İncele
          </button>
          <button className="btn btn-outline" onClick={resetTest}>
            Testi Tekrar Çöz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-up">
      <div className="panel panel-lg">
        <div className="flex-between mb-16">
          <span className="tag tag-accent">
            Soru {currentIdx + 1} / {quizQuestions.length}
          </span>
          <span className="text-muted text-sm">
            %{Math.round(((currentIdx + 1) / quizQuestions.length) * 100)} Tamamlandı
          </span>
        </div>

        <div className="progress mb-24">
          <span style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }} />
        </div>

        <h2 className="block-title">{quizQuestions[currentIdx].question}</h2>

        <div className="grid-auto">
          {quizQuestions[currentIdx].options.map((opt, idx) => (
            <button
              key={idx}
              className="btn btn-outline"
              onClick={() => handleAnswer(opt.scores)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
