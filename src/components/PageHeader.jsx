// src/components/PageHeader.jsx
// Tüm sayfaların başlık bloğu — görsel tutarlılığı tek yerden sağlar.

export function PageHeader({ kicker, title, desc, actions, icon: Icon }) {
  return (
    <header className="page-head">
      <div className="page-head-main">
        {Icon && (
          <span className="page-head-icon">
            <Icon />
          </span>
        )}
        <div>
          {kicker && <span className="page-kicker">{kicker}</span>}
          <h1 className="page-title">{title}</h1>
          {desc && <p className="page-desc">{desc}</p>}
        </div>
      </div>
      {actions && <div className="page-head-actions">{actions}</div>}
    </header>
  );
}
