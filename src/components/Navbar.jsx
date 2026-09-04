// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { APP_THEME } from '../constants/theme';
import { supabase } from '../lib/supabaseClient';
import {
  FaHome,
  FaUniversity,
  FaFlask,
  FaClipboardList,
  FaChartBar,
  FaCalculator,
  FaListAlt,
  FaStar,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserGraduate,
  FaSignOutAlt,
  FaUsers,
  FaGlobe,        // QS için
  FaTrophy,       // TÜMA için
  FaBriefcase,    // İstihdam için
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
  const theme = APP_THEME;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  
  const [className, setClassName] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      if (userRole === 'student' && userClassId) {
        const { data: classData } = await supabase
          .from('classes')
          .select('name')
          .eq('id', userClassId)
          .single();
          
        if (classData) {
          setClassName(classData.name);
        }

        const { data: studentsData } = await supabase
          .from('profiles')
          .select('name')
          .eq('class_id', userClassId)
          .eq('role', 'student');

        if (studentsData) {
          setClassStudents(studentsData); 
        }
      }
    };
    fetchClassInfo();
  }, [userRole, userClassId]);

  const handleTeacherPanelClick = () => {
    if (userRole === 'teacher') {
      setActiveTab('teacher-panel');
    } else {
      alert('⚠️ Bu alana sadece öğretmenler erişebilir.');
    }
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setMobileOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (showLoginModal && event.target.closest('.login-modal') === null) {
        setShowLoginModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => document.removeEventListener('mousedown', handleClickOutsideModal);
  }, [showLoginModal]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role },
          },
        });
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([{ id: data.user.id, name, role, email }]);
          if (profileError) throw profileError;
          alert('✅ Kayıt başarılı! Lütfen e-postanızı kontrol edin veya giriş yapın.');
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
      alert('❌ Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const menuConfig = [
    { id: 'anasayfa', label: 'Ana Sayfa', icon: FaHome },
    { id: 'universiteler', label: 'Üniversiteler', icon: FaUniversity },
    { id: 'student-profile', label: 'Profilim & Hedeflerim', icon: FaUserGraduate },
    // YENİ: QS, TÜMA, İstihdam
    { id: 'qs-rankings', label: '🌍 QS Sıralamaları', icon: FaGlobe },
    { id: 'tuma-rankings', label: '🏆 TÜMA Memnuniyet', icon: FaTrophy },
    { id: 'employment', label: '💼 İstihdam Analizi', icon: FaBriefcase },
    {
      label: 'Testler',
      icon: FaFlask,
      isDropdown: true,
      subItems: [
        { id: 'test', label: 'Üniversite Uyum Testi', icon: '🎯' },
        { id: 'holland-test', label: 'Holland Mesleki Tercih Testi', icon: '🧠' },
      ],
    },
    {
      label: 'Listelerim',
      icon: FaClipboardList,
      isDropdown: true,
      subItems: [
        { id: 'karsilastir', label: `Kıyas Listesi (${compareCount})`, icon: FaListAlt },
        { id: 'tercihlerim', label: `Tercih Listesi (${favoritesCount})`, icon: FaStar },
      ],
    },
    { id: 'puan-hesapla', label: 'Puan Hesapla', icon: FaCalculator },
    { id: 'simulasyon', label: 'Sıralama Simülasyonu', icon: FaChartBar },
    { 
      id: 'teacher-panel', 
      label: '👨‍🏫 Öğretmen Paneli', 
      icon: FaUserGraduate,
      action: handleTeacherPanelClick,
    },
    ...(user
      ? [
          {
            label: user.name || user.email?.split('@')[0] || 'Kullanıcı',
            icon: FaUserGraduate,
            isDropdown: true,
            subItems: [
              ...(userRole === 'student' && userClassId ? [
                { 
                  id: 'my-class', 
                  label: `📚 Sınıfım: ${className || 'Yükleniyor...'}`, 
                  icon: FaUsers,
                  action: () => setActiveTab('my-class'),
                }
              ] : []),
              { divider: true },
              { id: 'logout', label: 'Çıkış Yap', icon: FaSignOutAlt }
            ]
          }
        ]
      : [{ id: 'login', label: 'Giriş Yap', icon: FaSignInAlt, action: () => setShowLoginModal(true) }]),
  ];

  const toggleMobileDropdown = (key) => {
    setMobileOpenDropdown(mobileOpenDropdown === key ? null : key);
  };

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
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  };

  return (
    <>
      <nav
        style={{
          background: theme.navBg,
          padding: '0 24px',
          height: '76px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(24px)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          onClick={() => setActiveTab('anasayfa')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="eğitimince.com" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ color: theme.textPrimary, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            eğitimince<span style={{ color: theme.accentMain }}>.com</span>
          </span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.textPrimary,
            fontSize: '34px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '12px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            style={{
              position: 'absolute',
              top: '76px',
              left: 0,
              right: 0,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 999,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              maxHeight: 'calc(100vh - 76px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme.accentMain} rgba(0,0,0,0.05)`,
            }}
          >
            <style>
              {`
                .mobile-menu-scroll::-webkit-scrollbar { width: 5px; }
                .mobile-menu-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
                .mobile-menu-scroll::-webkit-scrollbar-thumb { background: ${theme.accentMain}; border-radius: 10px; }
              `}
            </style>
            <div className="mobile-menu-scroll" style={{ width: '100%' }}>
              {menuConfig.map((item, idx) => {
                const Icon = item.icon;
                if (item.isDropdown) {
                  const isOpen = mobileOpenDropdown === item.label;
                  return (
                    <div key={idx} style={{ marginBottom: '4px' }}>
                      <button
                        onClick={() => toggleMobileDropdown(item.label)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: theme.textPrimary,
                          fontWeight: '600',
                          fontSize: '16px',
                          padding: '14px 20px',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Icon style={{ fontSize: '20px' }} />
                          {item.label}
                        </span>
                        <span style={{ fontSize: '18px', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          ▾
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            if (sub.divider) {
                              return <hr key="divider" style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '8px 0' }} />;
                            }
                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleMenuItemClick(sub)}
                                style={{
                                  background: activeTab === sub.id ? `rgba(249,115,22,0.08)` : 'transparent',
                                  border: activeTab === sub.id ? `2px solid ${theme.accentMain}` : '2px solid transparent',
                                  color: activeTab === sub.id ? theme.accentMain : theme.textPrimary,
                                  fontWeight: activeTab === sub.id ? '700' : '500',
                                  cursor: 'pointer',
                                  fontSize: '15px',
                                  padding: '12px 16px',
                                  borderRadius: '12px',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  width: '100%',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  if (activeTab !== sub.id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                                }}
                                onMouseLeave={(e) => {
                                  if (activeTab !== sub.id) e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                {typeof SubIcon === 'string' ? (
                                  <span style={{ fontSize: '18px' }}>{SubIcon}</span>
                                ) : (
                                  <SubIcon style={{ fontSize: '18px' }} />
                                )}
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleMenuItemClick(item)}
                    style={{
                      background: activeTab === item.id ? `rgba(249,115,22,0.08)` : 'transparent',
                      border: activeTab === item.id ? `2px solid ${theme.accentMain}` : '2px solid transparent',
                      color: activeTab === item.id ? theme.accentMain : theme.textPrimary,
                      fontWeight: activeTab === item.id ? '700' : '500',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== item.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon style={{ fontSize: '22px' }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

     {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="login-modal"
            style={{
              background: theme.cardBg,
              padding: '40px',
              borderRadius: '24px',
              maxWidth: '420px',
              width: '100%',
              border: theme.cardBorder,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <h2 style={{ color: theme.textPrimary, textAlign: 'center', marginBottom: '24px' }}>
              {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </h2>
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <>
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                    <option value="student">Öğrenci</option>
                    <option value="teacher">Öğretmen</option>
                  </select>
                </>
              )}
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <button type="submit" style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? 'İşleniyor...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                {isRegister ? 'Zaten bir hesabın var mı?' : 'Henüz hesabın yok mu?'}
              </p>
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.accentMain}`,
                  background: 'transparent',
                  color: theme.accentMain,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(249,115,22,0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {isRegister ? 'Giriş Yap Ekranına Dön' : 'Kayıt Olmaya Geç'}
              </button>
            </div>

            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                marginTop: '16px',
                background: 'transparent',
                border: 'none',
                color: theme.textSecondary,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '16px',
  outline: 'none',
};

const buttonStyle = {
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: '#f97316',
  color: '#fff',
  fontSize: '18px',
  fontWeight: '700',
  cursor: 'pointer',
};