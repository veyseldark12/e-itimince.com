// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  FaHome,
  FaUniversity,
  FaFlask,
  FaListAlt,
  FaChartBar,
  FaCalculator,
  FaStar,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserGraduate,
  FaSignOutAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaGlobe,
  FaTrophy,
  FaBriefcase,
  FaBullseye,
  FaBrain,
} from 'react-icons/fa';

export function Navbar({
  activeTab,
  setActiveTab,
  compareCount,
  favoritesCount,
  user,
  userRole,
  userClassId,
  onLogout,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [className, setClassName] = useState('');
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  // Fareyle üzerine gelince menüyü aç; menüye geçişteki küçük boşluklar
  // yüzünden kapanmasın diye kapatma işlemi kısa bir gecikmeyle yapılır.
  const openDropdown = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopDropdown(key);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDesktopDropdown(null), 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const fetchClassInfo = async () => {
      if (userRole === 'student' && userClassId) {
        const { data: classData } = await supabase
          .from('classes')
          .select('name')
          .eq('id', userClassId)
          .single();

        if (classData) setClassName(classData.name);
      }
    };
    fetchClassInfo();
  }, [userRole, userClassId]);

  // Menü ve açılır kutular dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setMobileOpenDropdown(null);
        setDesktopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
    setDesktopDropdown(null);
  };

  const handleTeacherPanelClick = () => {
    if (userRole === 'teacher') {
      setActiveTab('teacher-panel');
    } else {
      alert('Bu alana sadece öğretmenler erişebilir.');
    }
    closeAll();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        // Rol her zaman 'student' olarak atanır; öğretmen rolü kullanıcı tarafından
        // seçilemez, yönetici tarafından veritabanından atanmalıdır.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role: 'student' },
          },
        });
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([{ id: data.user.id, name, role: 'student', email }]);
          if (profileError) throw profileError;
          alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin veya giriş yapın.');
          setIsRegister(false);
          setEmail('');
          setPassword('');
          setName('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role, class_id')
            .eq('id', data.user.id)
            .single();
          const userData = {
            ...data.user,
            name: profile?.name || data.user.email?.split('@')[0],
            role: profile?.role || 'student',
            class_id: profile?.class_id || null,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setShowLoginModal(false);
          setEmail('');
          setPassword('');
          window.location.reload();
        }
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const menuConfig = [
    { id: 'anasayfa', label: 'Ana Sayfa', icon: FaHome },
    { id: 'universiteler', label: 'Üniversiteler', icon: FaUniversity },
    {
      label: 'Sıralamalar',
      icon: FaTrophy,
      isDropdown: true,
      subItems: [
        { id: 'qs-rankings', label: 'QS Dünya Sıralaması', icon: FaGlobe },
        { id: 'tuma-rankings', label: 'TÜMA Memnuniyet', icon: FaTrophy },
        { id: 'employment', label: 'İstihdam Analizi', icon: FaBriefcase },
      ],
    },
    {
      label: 'Testler',
      icon: FaFlask,
      isDropdown: true,
      subItems: [
        { id: 'test', label: 'Üniversite Uyum Testi', icon: FaBullseye },
        { id: 'holland-test', label: 'Holland Mesleki Tercih Testi', icon: FaBrain },
      ],
    },
    {
      label: 'Araçlar',
      icon: FaCalculator,
      isDropdown: true,
      subItems: [
        { id: 'puan-hesapla', label: 'Puan Hesapla', icon: FaCalculator },
        { id: 'simulasyon', label: 'Sıralama Simülasyonu', icon: FaChartBar },
      ],
    },
    { id: 'karsilastir', label: 'Kıyas', icon: FaListAlt, badge: compareCount },
    { id: 'tercihlerim', label: 'Tercihlerim', icon: FaStar, badge: favoritesCount },
  ];

  const userItems = user
    ? [
        { id: 'student-profile', label: 'Profilim & Hedeflerim', icon: FaUserGraduate },
        ...(userRole === 'student' && userClassId
          ? [{ id: 'my-class', label: `Sınıfım: ${className || 'Yükleniyor...'}`, icon: FaUsers }]
          : []),
        { divider: true },
        { id: 'logout', label: 'Çıkış Yap', icon: FaSignOutAlt },
      ]
    : [];

  const isGroupActive = (item) => item.subItems?.some((s) => s.id === activeTab);

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.id) {
      if (item.id === 'logout') {
        onLogout();
        setActiveTab('anasayfa');
      } else {
        setActiveTab(item.id);
      }
    }
    closeAll();
  };

  const renderIcon = (Icon) => (Icon ? <Icon style={{ fontSize: '16px' }} /> : null);

  return (
    <>
      <nav className="nav" ref={navRef}>
        <button className="nav-brand" onClick={() => setActiveTab('anasayfa')}>
          <img src="/Logo.png" alt="eğitimince.com" />
          <span className="nav-brand-name">
            eğitimince<span className="text-accent">.com</span>
          </span>
        </button>

        {/* Masaüstü menüsü */}
        <div className="nav-menu">
          {menuConfig.map((item) => {
            if (item.isDropdown) {
              const open = desktopDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="nav-item"
                  onMouseEnter={() => openDropdown(item.label)}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <button
                    className={`nav-link ${isGroupActive(item) ? 'active' : ''}`}
                    onClick={() => openDropdown(item.label)}
                  >
                    {renderIcon(item.icon)}
                    {item.label}
                    <span className={`nav-caret ${open ? 'open' : ''}`}>▾</span>
                  </button>

                  {open && (
                    <div className="nav-dropdown">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          className={`nav-dropdown-item ${activeTab === sub.id ? 'active' : ''}`}
                          onClick={() => handleMenuItemClick(sub)}
                        >
                          {renderIcon(sub.icon)}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item)}
              >
                {renderIcon(item.icon)}
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>

        <div className="nav-right">
          <button
            className="nav-link hide-mobile"
            onClick={handleTeacherPanelClick}
            title="Öğretmen Paneli"
          >
            <FaChalkboardTeacher style={{ fontSize: '16px' }} />
            Öğretmen
          </button>

          {user ? (
            <div
              className="nav-item"
              onMouseEnter={() => openDropdown('__user__')}
              onMouseLeave={scheduleCloseDropdown}
            >
              <button
                className={`nav-link ${desktopDropdown === '__user__' ? 'active' : ''}`}
                onClick={() => openDropdown('__user__')}
              >
                <FaUserGraduate style={{ fontSize: '16px' }} />
                <span className="hide-mobile" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {(user.name || user.email?.split('@')[0] || 'Kullanıcı').split(' ')[0]}
                </span>
                <span className={`nav-caret ${desktopDropdown === '__user__' ? 'open' : ''}`}>▾</span>
              </button>

              {desktopDropdown === '__user__' && (
                <div className="nav-dropdown right">
                  {userItems.map((item, idx) =>
                    item.divider ? (
                      <hr key={`d-${idx}`} className="nav-divider" />
                    ) : (
                      <button
                        key={item.id}
                        className={`nav-dropdown-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        {renderIcon(item.icon)}
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setShowLoginModal(true)}>
              <FaSignInAlt /> <span className="hide-mobile">Giriş Yap</span>
            </button>
          )}

          <button
            className="nav-burger"
            aria-label="Menü"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setDesktopDropdown(null);
            }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {isMobileMenuOpen && (
        <div className="nav-mobile-panel">
          {menuConfig.map((item) => {
            if (item.isDropdown) {
              const open = mobileOpenDropdown === item.label;
              return (
                <div key={item.label}>
                  <button
                    className={`nav-mobile-link ${isGroupActive(item) ? 'active' : ''}`}
                    onClick={() => setMobileOpenDropdown(open ? null : item.label)}
                  >
                    {renderIcon(item.icon)}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span className={`nav-caret ${open ? 'open' : ''}`}>▾</span>
                  </button>

                  {open && (
                    <div className="nav-mobile-sub">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          className={`nav-mobile-link ${activeTab === sub.id ? 'active' : ''}`}
                          style={{ fontSize: '15px', padding: '11px 14px' }}
                          onClick={() => handleMenuItemClick(sub)}
                        >
                          {renderIcon(sub.icon)}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-mobile-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item)}
              >
                {renderIcon(item.icon)}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}

          <hr className="nav-divider" />

          <button className="nav-mobile-link" onClick={handleTeacherPanelClick}>
            <FaChalkboardTeacher style={{ fontSize: '18px' }} />
            Öğretmen Paneli
          </button>

          {user ? (
            userItems.map((item, idx) =>
              item.divider ? (
                <hr key={`d-${idx}`} className="nav-divider" />
              ) : (
                <button
                  key={item.id}
                  className={`nav-mobile-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {renderIcon(item.icon)}
                  {item.label}
                </button>
              )
            )
          ) : (
            <button
              className="btn btn-primary"
              style={{ marginTop: '8px' }}
              onClick={() => {
                setShowLoginModal(true);
                closeAll();
              }}
            >
              <FaSignInAlt /> Giriş Yap
            </button>
          )}
        </div>
      )}

      {/* Giriş / Kayıt modalı */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-card login-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textAlign: 'center', marginBottom: '22px' }}>
              {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </h2>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'İşleniyor...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </form>

            <div style={{ marginTop: '18px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
                {isRegister ? 'Zaten bir hesabın var mı?' : 'Henüz hesabın yok mu?'}
              </p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Giriş Yap Ekranına Dön' : 'Kayıt Olmaya Geç'}
              </button>
            </div>

            <button
              onClick={() => setShowLoginModal(false)}
              className="btn btn-ghost"
              style={{ marginTop: '10px', width: '100%', fontSize: '14px' }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
