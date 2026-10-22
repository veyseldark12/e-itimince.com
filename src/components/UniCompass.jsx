// src/components/UniCompass.jsx

import { FaCompass } from 'react-icons/fa';
import { APP_THEME } from '../constants/theme';
import { uniDatabase } from '../data/uniDatabase';
import { UNI_COMPASS, COMPASS_LABELS, calculateUserPosition } from '../data/uniCompass';

const SIZE = 560;
const CENTER = SIZE / 2;
const SCALE = 24; // 1 eksen birimi = 24px  (aralık -10..+10 -> 480px)

const toPx = (x) => CENTER + x * SCALE;
const toPy = (y) => CENTER - y * SCALE; // y ekseni yukarı pozitif olduğu için ters çevrilir

export function UniCompass({ percentageResults, topKey }) {
  const theme = APP_THEME;
  const userPos = calculateUserPosition(percentageResults);

  return (
    <div style={{ margin: '0 auto 40px', maxWidth: '640px' }}>
      <h3
        style={{
          color: theme.textPrimary,
          fontSize: '17px',
          fontWeight: '800',
          letterSpacing: '1px',
          margin: '0 0 16px 0',
          textTransform: 'uppercase',
        }}
      >
        <FaCompass /> Üniversite Uyum Pusulası
      </h3>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        role="img"
        aria-label="Üniversite uyum pusulası"
        style={{ display: 'block', borderRadius: '24px', border: theme.cardBorder }}
      >
        <defs>
          <filter id="userGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arka plan ve dört bölge */}
        <rect x="0" y="0" width={SIZE} height={SIZE} fill="rgba(15, 23, 42, 0.85)" />
        <rect x={CENTER} y="0" width={CENTER} height={CENTER} fill="rgba(56, 189, 248, 0.07)" />
        <rect x="0" y="0" width={CENTER} height={CENTER} fill="rgba(245, 158, 11, 0.07)" />
        <rect x="0" y={CENTER} width={CENTER} height={CENTER} fill="rgba(168, 85, 247, 0.07)" />
        <rect x={CENTER} y={CENTER} width={CENTER} height={CENTER} fill="rgba(16, 185, 129, 0.07)" />

        {/* Eş merkezli halkalar (pusula hissi) */}
        {[60, 120, 180, 240].map((r) => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeDasharray="4 7"
          />
        ))}

        {/* Eksenler */}
        <line x1="40" y1={CENTER} x2={SIZE - 40} y2={CENTER} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        <line x1={CENTER} y1="40" x2={CENTER} y2={SIZE - 40} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />

        {/* Eksen etiketleri */}
        <text x={CENTER} y="26" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.55)">
          {COMPASS_LABELS.top}
        </text>
        <text x={CENTER} y={SIZE - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.55)">
          {COMPASS_LABELS.bottom}
        </text>
        <text x="14" y={CENTER - 12} textAnchor="start" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.55)">
          {COMPASS_LABELS.left}
        </text>
        <text x={SIZE - 14} y={CENTER - 12} textAnchor="end" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.55)">
          {COMPASS_LABELS.right}
        </text>

        {/* Üniversiteler */}
        {Object.entries(UNI_COMPASS).map(([key, pos]) => {
          const uni = uniDatabase[key];
          if (!uni) return null;

          const px = toPx(pos.x);
          const py = toPy(pos.y);
          const isTop = key === topKey;
          const score = percentageResults?.find((item) => item.key === key);

          return (
            <g key={key}>
              <circle
                cx={px}
                cy={py}
                r={isTop ? 11 : 7}
                fill={uni.color}
                stroke={isTop ? '#ffffff' : 'rgba(15,23,42,0.9)'}
                strokeWidth={isTop ? 3 : 2}
              />
              <text
                x={px}
                y={py + 22}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isTop ? '800' : '600'}
                fill={isTop ? '#ffffff' : 'rgba(255,255,255,0.85)'}
              >
                {pos.short}
                {isTop && score ? ` %${score.percent}` : ''}
              </text>
            </g>
          );
        })}

        {/* Kullanıcının konumu */}
        {userPos && (
          <g filter="url(#userGlow)">
            <circle cx={toPx(userPos.x)} cy={toPy(userPos.y)} r="18" fill="rgba(245, 158, 11, 0.35)">
              <animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.08;0.4" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle
              cx={toPx(userPos.x)}
              cy={toPy(userPos.y)}
              r="9"
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <text
              x={toPx(userPos.x)}
              y={toPy(userPos.y) - 24}
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#fbbf24"
            >
              SEN
            </text>
          </g>
        )}
      </svg>

      <div
        style={{
          display: 'flex',
          gap: '18px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '16px',
          fontSize: '12px',
          color: theme.textSecondary,
        }}
      >
        <span>
          <span style={{ color: '#fbbf24', fontWeight: '800' }}>● SEN</span> = senin konumun
        </span>
        <span>
          <span style={{ color: '#ffffff', fontWeight: '800' }}>●</span> Renkli noktalar = üniversiteler
        </span>
        <span>Yakınlık = uyum düzeyi</span>
      </div>
    </div>
  );
}
