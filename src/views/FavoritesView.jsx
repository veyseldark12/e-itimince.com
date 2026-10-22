// src/views/FavoritesView.jsx

import { FaStar, FaBullseye, FaUniversity } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';

export function FavoritesView({ favorites, allDepartments, toggleFavorite }) {
  const favoriteDepts = allDepartments.filter((d) => favorites.includes(d.id));

  return (
    <div>
      <PageHeader
        icon={FaStar}
        kicker="TERCİHLERİM"
        title="Tercih Listem"
        desc="Yıldızladığınız favori bölümleriniz burada listelenir."
      />

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaStar />
          </div>
          <h3 className="empty-title">Henüz favori eklemediniz</h3>
          <p className="text-muted">
            Tercih listeniz henüz boş. Üniversite bölümlerinin yanındaki yıldız ikonuna tıklayarak favorilerinize ekleyin.
          </p>
          <div className="mt-16">
            <button
              className="btn btn-primary"
              onClick={() => { window.location.hash = '#/test'; }}
            >
              <FaBullseye /> Uyum Testini Çöz
            </button>{' '}
            <button
              className="btn btn-outline"
              onClick={() => { window.location.hash = '#/universiteler'; }}
            >
              <FaUniversity /> Üniversiteleri Keşfet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-auto grid-2">
          {favoriteDepts.map((dept) => (
            <div key={dept.id} className="panel hover-lift">
              <div className="flex-between mb-16">
                <span className="tag tag-accent">{dept.uniName}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  aria-label="Favorilerden çıkar"
                  onClick={() => toggleFavorite(dept.id)}
                >
                  <FaStar />
                </button>
              </div>

              <h3 className="block-title">{dept.name}</h3>

              <div className="flex-wrap mb-16">
                <span className="tag">{dept.type}</span>
                <span className="tag">Sıra: {dept.rank2025}</span>
                <span className="tag">Kont: {dept.quota}</span>
              </div>

              <p className="card-desc">{dept.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
