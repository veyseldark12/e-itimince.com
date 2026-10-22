// src/components/StatCard.jsx

export function StatCard({ title, value, icon, color }) {
  const cardColor = color || 'var(--cyan)';

  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ borderColor: cardColor }}>
        {icon}
      </div>
      <div>
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
}
