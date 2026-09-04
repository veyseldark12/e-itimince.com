// src/views/TeacherPanelView.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_THEME } from '../constants/theme';
import { PROFESSIONS_DATABASE } from '../constants/professionsData';

export function TeacherPanelView() {
  const theme = APP_THEME;

  // State Yönetimi
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [studentData, setStudentData] = useState(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null); 
  
  const [studentNotes, setStudentNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Yeni Sınıf Form State'leri
  const [newClassName, setNewClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [description, setDescription] = useState('');

  // Öğrenci Ekleme ve Arama State'leri
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sınıfları Veritabanından Çekme
  const fetchClasses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id);

    if (error) {
      console.error('Sınıflar çekilirken hata oluştu:', error.message);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Seçilen Sınıfın Öğrencilerini Çekme
  const fetchStudents = async (classId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('class_id', classId)
      .eq('role', 'student'); 

    if (error) {
      console.error('Öğrenciler çekilirken hata oluştu:', error.message);
    } else {
      setStudents(data || []);
      setSelectedClass(classId);
      setSelectedStudent(null);
      setStudentData(null);
      setSelectedStudentProfile(null);
      setStudentNotes([]);
    }
    setLoading(false);
  };

  // Seçilen Öğrencinin Detaylı Verilerini, Test Sonuçlarını ve Notlarını Çekme
  const fetchStudentData = async (studentId) => {
    setLoading(true);
    
    // Öğrenci test verileri
    const { data: testData, error: testError } = await supabase
      .from('student_data')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (testError) {
      console.error('Öğrenci test verileri çekilemedi:', testError.message);
    }

    // Profil bilgisi
    const profileData = students.find(s => s.id === studentId);

    // Öğretmen koçluk notları
    const { data: notesData, error: notesError } = await supabase
      .from('teacher_notes')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Koçluk notları çekilemedi:', notesError.message);
    }

    setStudentData(testData || {});
    setSelectedStudentProfile(profileData || null);
    setSelectedStudent(studentId);
    setStudentNotes(notesData || []);
    setLoading(false);
  };

  // Yeni Sınıf Oluşturma Fonksiyonu
  const createClass = async () => {
    if (!newClassName.trim()) {
      setMessage('⚠️ Sınıf adı zorunludur.');
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('classes')
      .insert([{ 
        name: newClassName.trim(), 
        teacher_id: user.id,
        school_name: schoolName.trim(),
        capacity: parseInt(capacity, 10) || 30,
        description: description.trim()
      }]);

    if (!error) {
      setMessage('✅ Sınıf başarıyla oluşturuldu!');
      setNewClassName(''); 
      setSchoolName(''); 
      setCapacity(30); 
      setDescription('');
      fetchClasses();
    } else {
      setMessage('❌ Hata oluştu: ' + error.message);
    }
    setLoading(false);
  };

  // Sınıf Silme Fonksiyonu
  const deleteClass = async (classId) => {
    if (!window.confirm('Bu sınıfı silmek istediğinize emin misiniz? Sınıftaki öğrencilerin sınıf bağlantısı kaldırılacaktır.')) return;
    
    setLoading(true);
    await supabase.from('profiles').update({ class_id: null }).eq('class_id', classId);
    
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    
    if (!error) {
      setMessage('✅ Sınıf başarıyla silindi!');
      setSelectedClass(null); 
      setStudents([]); 
      setSelectedStudent(null);
      fetchClasses();
    } else {
      setMessage('❌ Sınıf silinirken hata oluştu: ' + error.message);
    }
    setLoading(false);
  };

  // Sınıfa E-posta ile Öğrenci Ekleme
  const addStudent = async () => {
    if (!studentEmail.trim()) {
      setMessage('⚠️ Lütfen bir öğrenci e-posta adresi girin.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, role, class_id')
        .eq('email', studentEmail.trim())
        .maybeSingle();

      if (userError || !userData) { 
        setMessage('❌ Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.'); 
        setLoading(false); 
        return; 
      }
      
      if (userData.role !== 'student') { 
        setMessage(`❌ Bu kullanıcı bir öğrenci hesabı değil.`); 
        setLoading(false); 
        return; 
      }
      
      if (userData.class_id) { 
        setMessage('⚠️ Bu öğrenci halihazırda başka bir sınıfa kayıtlı.'); 
        setLoading(false); 
        return; 
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ class_id: selectedClass })
        .eq('id', userData.id);

      if (!updateError) {
        setMessage('✅ Öğrenci sınıfa başarıyla eklendi!');
        setStudentEmail('');
        await fetchStudents(selectedClass);
      } else {
        setMessage('❌ Öğrenci eklenirken hata: ' + updateError.message);
      }
    } catch (err) {
      setMessage('❌ Beklenmeyen bir hata oluştu: ' + err.message);
    }
    setLoading(false);
  };

  // Öğrenciyi Sınıftan Çıkarma
  const removeStudent = async (studentId) => {
    if (!window.confirm('Öğrenciyi bu sınıftan çıkarmak istediğinize emin misiniz?')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ class_id: null })
      .eq('id', studentId);
      
    if (!error) {
      setMessage('✅ Öğrenci sınıftan çıkarıldı!');
      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (selectedStudent === studentId) { 
        setSelectedStudent(null); 
        setStudentData(null); 
        setSelectedStudentProfile(null); 
        setStudentNotes([]);
      }
    } else {
      setMessage('❌ Hata oluştu: ' + error.message);
    }
    setLoading(false);
  };

  // Yeni Koçluk Notu Ekleme
  const addTeacherNote = async () => {
    if (!newNoteText.trim() || !selectedStudent) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('teacher_notes')
      .insert([{
        teacher_id: user.id,
        student_id: selectedStudent,
        note: newNoteText.trim()
      }])
      .select()
      .single();

    if (!error && data) {
      setStudentNotes([data, ...studentNotes]);
      setNewNoteText('');
    } else {
      console.error('Not eklenirken hata:', error?.message);
    }
    setLoading(false);
  };

  // Koçluk Notunu Silme
  const deleteTeacherNote = async (noteId) => {
    const { error } = await supabase
      .from('teacher_notes')
      .delete()
      .eq('id', noteId);
      
    if (!error) {
      setStudentNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    } else {
      console.error('Not silinemedi:', error.message);
    }
  };

  // Holland Tipleri ve Meslek Uyum Analizi Fonksiyonu
  const analyzeCompatibility = (studentHollandType, targetProfessionName) => {
    if (!studentHollandType || !targetProfessionName) return null;

    const foundProfession = PROFESSIONS_DATABASE.find(p => p.name === targetProfessionName);
    const professionType = foundProfession ? foundProfession.type : "Bilinmiyor";
    
    const cleanStudentType = studentHollandType.includes("Gerçekçi") ? "Gerçekçi" :
                             studentHollandType.includes("Araştırmacı") ? "Araştırmacı" :
                             studentHollandType.includes("Sanatsal") ? "Sanatsal" :
                             studentHollandType.includes("Sosyal") ? "Sosyal" :
                             studentHollandType.includes("Girişimci") ? "Girişimci" :
                             studentHollandType.includes("Geleneksel") ? "Geleneksel" : "";

    const isCompatible = cleanStudentType === professionType;

    let reasoning = `Öğrencinin baskın tipi (${cleanStudentType}), seçtiği "${targetProfessionName}" mesleğinin gereksinimi olan (${professionType}) özelliklerle `;

    return {
      status: isCompatible ? 'Uyumlu' : 'Dikkat Edilmeli',
      color: isCompatible ? '#10b981' : '#f59e0b',
      message: isCompatible 
        ? reasoning + "tamamen örtüşmektedir. Öğrencinin potansiyeli bu alanda başarılı olması için oldukça uygundur." 
        : reasoning + "tam olarak uyuşmamaktadır. Öğrencinin kariyer yönelimi ile hedeflediği alan arasında farklılıklar bulunuyor, detaylı değerlendirilmelidir."
    };
  };

  // Öğrenci Arama Filtrelemesi
  const filteredStudents = students.filter(s =>
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Üst Başlık Alanı */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ color: theme.accentMain, fontSize: '28px', margin: '0 0 5px 0' }}>👨‍🏫 Öğretmen Paneli & Kariyer Koçluğu</h2>
          <p style={{ color: theme.textSecondary, fontSize: '14px', margin: 0 }}>Sınıflarınızı yönetin, öğrencilerin kariyer hedeflerini ve test sonuçlarını analiz edin.</p>
        </div>
        <span style={{ color: theme.textSecondary, fontSize: '14px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          Toplam: {classes.length} Sınıf • {students.length} Öğrenci
        </span>
      </div>

      {/* Mesaj Bildirim Alanı */}
      {message && (
        <div style={{ 
          background: message.includes('✅') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
          border: `1px solid ${message.includes('✅') ? '#10b981' : '#ef4444'}`, 
          padding: '12px 20px', 
          borderRadius: '12px', 
          marginBottom: '20px', 
          color: message.includes('✅') ? '#10b981' : '#ef4444',
          fontWeight: '500',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{message}</span>
          <button onClick={() => setMessage('')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>
      )}

      {/* Ana Grid Düzeni */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        
        {/* SOL KOLON: Sınıf Oluşturma ve Sınıf Listesi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Yeni Sınıf Oluştur Kartı */}
          <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '16px', border: theme.cardBorder }}>
            <h4 style={{ color: theme.textPrimary, marginBottom: '16px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              📚 Yeni Sınıf Oluştur
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Sınıf Adı (örn: 11-A Fen)" 
                value={newClassName} 
                onChange={(e) => setNewClassName(e.target.value)} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', outline: 'none' }} 
              />
              <input 
                type="text" 
                placeholder="Okul Adı" 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', outline: 'none' }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: theme.textSecondary, fontSize: '13px', width: '80px' }}>Kapasite:</span>
                <input 
                  type="number" 
                  value={capacity} 
                  onChange={(e) => setCapacity(e.target.value)} 
                  min="1" 
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              <textarea 
                placeholder="Sınıf açıklaması..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '60px' }} 
              />
              <button 
                onClick={createClass} 
                disabled={loading} 
                style={{ padding: '12px', background: theme.accentMain, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' }}
              >
                {loading ? 'İşleniyor...' : 'Sınıfı Oluştur'}
              </button>
            </div>
          </div>

          {/* Sınıflarım Listesi Kartı */}
          <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '16px', border: theme.cardBorder }}>
            <h4 style={{ color: theme.textPrimary, marginBottom: '12px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              📋 Sınıflarım
            </h4>
            {classes.length === 0 ? (
              <p style={{ color: theme.textSecondary, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Henüz kayıtlı sınıfınız bulunmuyor.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                {classes.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => fetchStudents(c.id)} 
                    style={{ 
                      background: selectedClass === c.id ? `rgba(249,115,22,0.15)` : 'rgba(255,255,255,0.03)', 
                      padding: '12px 16px', 
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      border: selectedClass === c.id ? `1px solid ${theme.accentMain}` : '1px solid transparent', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <span style={{ color: theme.textPrimary, fontWeight: selectedClass === c.id ? '700' : '500', display: 'block' }}>{c.name}</span>
                      <span style={{ color: theme.textSecondary, fontSize: '12px' }}>{c.school_name || 'Okul belirtilmemiş'}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteClass(c.id); }} 
                      title="Sınıfı Sil"
                      style={{ background: 'transparent', border: 'none', color: theme.danger, cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: Öğrenci Yönetimi ve Detaylı Koçluk Analizi */}
        <div>
          {selectedClass ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Sınıf Öğrencileri Başlık ve Ekleme Paneli */}
              <div style={{ background: theme.cardBg, padding: '16px 20px', borderRadius: '16px', border: theme.cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h4 style={{ color: theme.textPrimary, fontSize: '18px', margin: 0 }}>👨‍🎓 Sınıf Öğrencileri</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Öğrenci ara..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', outline: 'none' }} 
                  />
                  <input 
                    type="email" 
                    placeholder="Öğrenci e-postası..." 
                    value={studentEmail} 
                    onChange={(e) => setStudentEmail(e.target.value)} 
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', outline: 'none' }} 
                  />
                  <button 
                    onClick={addStudent} 
                    disabled={loading} 
                    style={{ padding: '8px 18px', background: theme.accentMain, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ➕ Ekle
                  </button>
                </div>
              </div>

              {/* Öğrenci Listesi ve Seçilen Öğrenci Detay Paneli (İki Sütun Yan Yana) */}
              <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 1.6fr' : '1fr', gap: '20px' }}>
                
                {/* Öğrenci Listesi */}
                <div style={{ background: theme.cardBg, padding: '16px', borderRadius: '16px', border: theme.cardBorder, maxHeight: '650px', overflowY: 'auto' }}>
                  {filteredStudents.length === 0 ? (
                    <p style={{ color: theme.textSecondary, fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>Bu sınıfta öğrenci bulunamadı veya arama sonucu eşleşmedi.</p>
                  ) : (
                    filteredStudents.map((s) => (
                      <div 
                        key={s.id} 
                        onClick={() => fetchStudentData(s.id)} 
                        style={{ 
                          padding: '12px 14px', 
                          background: selectedStudent === s.id ? `rgba(139,92,246,0.2)` : 'rgba(255,255,255,0.03)', 
                          borderRadius: '10px', 
                          cursor: 'pointer', 
                          border: selectedStudent === s.id ? `1px solid #8b5cf6` : '1px solid transparent', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '8px',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                          <div style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name || 'İsimsiz Öğrenci'}</div>
                          <div style={{ color: theme.textSecondary, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeStudent(s.id); }} 
                          title="Sınıftan Çıkar"
                          style={{ background: 'transparent', border: 'none', color: theme.danger, cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Seçilen Öğrenci Detay, Hedef, Test ve Koçluk Notları Paneli */}
                {selectedStudent && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '650px', overflowY: 'auto', paddingRight: '4px' }}>
                    
                    {/* Hedef Kartı */}
                    <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '16px', border: theme.cardBorder }}>
                      <h4 style={{ color: theme.textPrimary, marginBottom: '16px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        🎯 {selectedStudentProfile?.name || 'Öğrenci'} - Hedef Kartı
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hedef Üniversite</span> <br/> 
                          <strong style={{ fontSize: '14px', color: theme.textPrimary, display: 'block', marginTop: '4px' }}>
                            {selectedStudentProfile?.target_university || selectedStudentProfile?.university || selectedStudentProfile?.target_uni || selectedStudentProfile?.hedef_universite || 'Belirtilmemiş'}
                          </strong>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: theme.textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hedef Meslek</span> <br/> 
                          <strong style={{ color: theme.accentMain, fontSize: '14px', display: 'block', marginTop: '4px' }}>
                            {selectedStudentProfile?.target_department || selectedStudentProfile?.department || selectedStudentProfile?.hedef_bolum || 'Belirtilmemiş'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Test Sonuçları & Uyum Analizi */}
                    <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '16px', border: theme.cardBorder }}>
                      <h4 style={{ color: theme.textPrimary, marginBottom: '16px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        📊 Test Sonuçları & Uyum Analizi
                      </h4>
                      
                      {studentData && Object.keys(studentData).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>Holland Baskın Tip</span><br/>
                            <strong style={{ fontSize: '15px', color: theme.textPrimary, marginTop: '4px', display: 'block' }}>
                              {studentData.holland_result?.top1 || 'Henüz test verisi bulunmuyor'}
                            </strong>
                          </div>

                          {selectedStudentProfile?.target_department && studentData.holland_result ? (
                            (() => {
                              const analysis = analyzeCompatibility(studentData.holland_result.top1, selectedStudentProfile.target_department);
                              if (analysis) {
                                return (
                                  <div style={{ background: '#1e293b', border: `1px solid ${analysis.color}`, padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                      <strong style={{ color: analysis.color, fontSize: '15px' }}>💡 Sistem AI Analizi</strong>
                                      <span style={{ background: analysis.color, color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {analysis.status}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6', fontWeight: '400' }}>
                                      {analysis.message}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            })()
                          ) : (
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: theme.textSecondary, textAlign: 'center' }}>
                              Detaylı uyum analizi için öğrencinin hem hedef meslek seçmesi hem de Holland kariyer testini tamamlaması gerekmektedir.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: theme.textSecondary }}>
                          <p style={{ margin: 0, fontSize: '14px' }}>Öğrenci henüz platformda test çözmemiş.</p>
                        </div>
                      )}
                    </div>

                    {/* Koçluk Notları Bölümü */}
                    <div style={{ background: theme.cardBg, padding: '20px', borderRadius: '16px', border: theme.cardBorder }}>
                      <h4 style={{ color: theme.textPrimary, marginBottom: '16px', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        📝 Koçluk Notları & Görüşmeler
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        <textarea 
                          placeholder="Öğrenci hakkında özel koçluk notu yazın..." 
                          value={newNoteText} 
                          onChange={(e) => setNewNoteText(e.target.value)} 
                          style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px' }} 
                        />
                        <button 
                          onClick={addTeacherNote} 
                          style={{ alignSelf: 'flex-end', padding: '8px 20px', background: theme.accentMain, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                        >
                          Notu Kaydet
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                        {studentNotes.length === 0 ? (
                          <p style={{ color: theme.textSecondary, fontSize: '13px', textAlign: 'center', margin: '10px 0' }}>Bu öğrenci için henüz not eklenmemiş.</p>
                        ) : (
                          studentNotes.map((n) => (
                            <div key={n.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#e5e7eb', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{n.note}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: theme.textSecondary }}>
                                <span>{new Date(n.created_at).toLocaleString('tr-TR')}</span>
                                <button 
                                  onClick={() => deleteTeacherNote(n.id)} 
                                  style={{ background: 'transparent', border: 'none', color: theme.danger, cursor: 'pointer', fontSize: '12px' }}
                                >
                                  🗑️ Sil
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          ) : (
            <div style={{ background: theme.cardBg, padding: '80px 20px', borderRadius: '16px', border: theme.cardBorder, textAlign: 'center' }}>
              <h3 style={{ color: theme.textPrimary, margin: '0 0 8px 0', fontSize: '20px' }}>Sınıf Seçilmedi</h3>
              <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>Öğrencileri, hedef analizlerini ve koçluk notlarını görüntülemek için sol taraftaki listeden bir sınıf seçin.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}