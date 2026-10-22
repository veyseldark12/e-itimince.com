// src/views/TeacherPanelView.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PROFESSIONS_DATABASE } from '../constants/professionsData';
import { PageHeader } from '../components/PageHeader';
import {
  FaBan,
  FaBook,
  FaBullseye,
  FaChalkboardTeacher,
  FaChartBar,
  FaClipboardList,
  FaLightbulb,
  FaPlus,
  FaStickyNote,
  FaTimes,
  FaTrash,
  FaUserGraduate,
} from 'react-icons/fa';

// Holland testi tipi harf olarak saklanır (R/I/A/S/E/C), meslek veritabanı ise
// Türkçe ad kullanır ("Gerçekçi" vb.). Aşağıdaki eşleme bu ikisini birleştirir.
const HOLLAND_TYPE_NAMES = {
  R: 'Gerçekçi',
  I: 'Araştırmacı',
  A: 'Sanatsal',
  S: 'Sosyal',
  E: 'Girişimci',
  C: 'Geleneksel',
};

// Hem harf ("R") hem de Türkçe ad ("Gerçekçi") girdisini Türkçe ada çevirir.
const hollandTypeName = (type) => {
  if (!type) return '';
  if (HOLLAND_TYPE_NAMES[type]) return HOLLAND_TYPE_NAMES[type];
  return Object.values(HOLLAND_TYPE_NAMES).find((name) => type.includes(name)) || '';
};

export function TeacherPanelView({ userRole }) {
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
    if (userRole !== 'teacher') return;
    fetchClasses();
  }, [userRole]);

  // Rol kontrolü: yalnızca öğretmen hesapları bu panele erişebilir.
  // (Tüm hook'lar yukarıda çağrıldığı için bu erken dönüş güvenlidir.)
  if (userRole !== 'teacher') {
    return (
      <div className="empty-state">
        <div className="empty-icon"><FaBan /></div>
        <h3 className="empty-title">Erişim Engellendi</h3>
        <p className="text-muted">
          Bu sayfayı yalnızca öğretmen hesapları görüntüleyebilir.
        </p>
      </div>
    );
  }

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
      setMessage('Sınıf adı zorunludur.');
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
      setMessage('Sınıf başarıyla oluşturuldu!');
      setNewClassName('');
      setSchoolName('');
      setCapacity(30);
      setDescription('');
      fetchClasses();
    } else {
      setMessage('Hata oluştu: ' + error.message);
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
      setMessage('Sınıf başarıyla silindi!');
      setSelectedClass(null);
      setStudents([]);
      setSelectedStudent(null);
      fetchClasses();
    } else {
      setMessage('Sınıf silinirken hata oluştu: ' + error.message);
    }
    setLoading(false);
  };

  // Sınıfa E-posta ile Öğrenci Ekleme
  const addStudent = async () => {
    if (!studentEmail.trim()) {
      setMessage('Lütfen bir öğrenci e-posta adresi girin.');
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
        setMessage('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      if (userData.role !== 'student') {
        setMessage(`Bu kullanıcı bir öğrenci hesabı değil.`);
        setLoading(false);
        return;
      }

      if (userData.class_id) {
        setMessage('Bu öğrenci halihazırda başka bir sınıfa kayıtlı.');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ class_id: selectedClass })
        .eq('id', userData.id);

      if (!updateError) {
        setMessage('Öğrenci sınıfa başarıyla eklendi!');
        setStudentEmail('');
        await fetchStudents(selectedClass);
      } else {
        setMessage('Öğrenci eklenirken hata: ' + updateError.message);
      }
    } catch (err) {
      setMessage('Beklenmeyen bir hata oluştu: ' + err.message);
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
      setMessage('Öğrenci sınıftan çıkarıldı!');
      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (selectedStudent === studentId) {
        setSelectedStudent(null);
        setStudentData(null);
        setSelectedStudentProfile(null);
        setStudentNotes([]);
      }
    } else {
      setMessage('Hata oluştu: ' + error.message);
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

    const cleanStudentType = hollandTypeName(studentHollandType);

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
    <div className="animate-up">
      <PageHeader
        icon={FaChalkboardTeacher}
        kicker="Öğretmen Paneli"
        title="Öğretmen Paneli & Kariyer Koçluğu"
        desc="Sınıflarınızı yönetin, öğrencilerin kariyer hedeflerini ve test sonuçlarını analiz edin."
        actions={
          <span className="tag">
            Toplam: {classes.length} Sınıf • {students.length} Öğrenci
          </span>
        }
      />

      {/* Mesaj Bildirim Alanı */}
      {message && (
        <div
          className="note flex-between mb-16"
          style={{ color: message.includes('başarıyla') || message.includes('çıkarıldı') ? 'var(--success)' : 'var(--danger)' }}
        >
          <span>{message}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setMessage('')}><FaTimes /></button>
        </div>
      )}

      {/* Ana Grid Düzeni */}
      <div className="grid-auto grid-2">
        {/* SOL KOLON: Sınıf Oluşturma ve Sınıf Listesi */}
        <div className="grid-auto">
          {/* Yeni Sınıf Oluştur Kartı */}
          <div className="panel">
            <h4 className="panel-title"><FaBook /> Yeni Sınıf Oluştur</h4>
            <div className="grid-auto">
              <input
                type="text"
                placeholder="Sınıf Adı (örn: 11-A Fen)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Okul Adı"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <div className="field">
                <label className="field-label">Kapasite:</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                />
              </div>
              <textarea
                placeholder="Sınıf açıklaması..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className="btn btn-primary" onClick={createClass} disabled={loading}>
                {loading ? 'İşleniyor...' : 'Sınıfı Oluştur'}
              </button>
            </div>
          </div>

          {/* Sınıflarım Listesi Kartı */}
          <div className="panel">
            <h4 className="panel-title"><FaClipboardList /> Sınıflarım</h4>
            {classes.length === 0 ? (
              <p className="text-muted text-sm text-center">Henüz kayıtlı sınıfınız bulunmuyor.</p>
            ) : (
              <div className="grid-auto">
                {classes.map((c) => (
                  <div
                    key={c.id}
                    className="list-row flex-between"
                    onClick={() => fetchStudents(c.id)}
                    style={selectedClass === c.id ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
                  >
                    <div>
                      <div className="td-strong">{c.name}</div>
                      <div className="text-muted text-sm">{c.school_name || 'Okul belirtilmemiş'}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteClass(c.id); }}
                      title="Sınıfı Sil"
                      className="btn btn-ghost btn-sm"
                    >
                      <FaTrash />
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
            <div className="grid-auto">
              {/* Sınıf Öğrencileri Başlık ve Ekleme Paneli */}
              <h4 className="block-title"><FaUserGraduate /> Sınıf Öğrencileri</h4>

              <div className="toolbar">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Öğrenci ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Öğrenci e-postası..."
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={addStudent} disabled={loading}>
                  <FaPlus /> Ekle
                </button>
              </div>

              {/* Öğrenci Listesi ve Seçilen Öğrenci Detay Paneli */}
              <div className={selectedStudent ? 'grid-auto grid-2' : 'grid-auto'}>
                {/* Öğrenci Listesi */}
                <div className="panel">
                  {filteredStudents.length === 0 ? (
                    <p className="text-muted text-sm text-center">
                      Bu sınıfta öğrenci bulunamadı veya arama sonucu eşleşmedi.
                    </p>
                  ) : (
                    <div className="grid-auto">
                      {filteredStudents.map((s) => (
                        <div
                          key={s.id}
                          className="list-row flex-between"
                          onClick={() => fetchStudentData(s.id)}
                          style={selectedStudent === s.id ? { borderColor: 'var(--violet)', background: 'var(--violet-soft)' } : undefined}
                        >
                          <div>
                            <div className="td-strong">{s.name || 'İsimsiz Öğrenci'}</div>
                            <div className="text-muted text-sm">{s.email}</div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeStudent(s.id); }}
                            title="Sınıftan Çıkar"
                            className="btn btn-ghost btn-sm"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seçilen Öğrenci Detay, Hedef, Test ve Koçluk Notları Paneli */}
                {selectedStudent && (
                  <div className="grid-auto">
                    {/* Hedef Kartı */}
                    <div className="panel">
                      <h4 className="panel-title">
                        <FaBullseye /> {selectedStudentProfile?.name || 'Öğrenci'} - Hedef Kartı
                      </h4>
                      <div className="grid-auto grid-2">
                        <div className="stat-tile">
                          <div className="stat-label">Hedef Üniversite</div>
                          <div className="stat-value">
                            {selectedStudentProfile?.target_university || selectedStudentProfile?.university || selectedStudentProfile?.target_uni || selectedStudentProfile?.hedef_universite || 'Belirtilmemiş'}
                          </div>
                        </div>
                        <div className="stat-tile">
                          <div className="stat-label">Hedef Meslek</div>
                          <div className="stat-value text-accent">
                            {selectedStudentProfile?.target_department || selectedStudentProfile?.department || selectedStudentProfile?.hedef_bolum || 'Belirtilmemiş'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Sonuçları & Uyum Analizi */}
                    <div className="panel">
                      <h4 className="panel-title"><FaChartBar /> Test Sonuçları & Uyum Analizi</h4>

                      {studentData && Object.keys(studentData).length > 0 ? (
                        <div className="grid-auto">
                          <div className="stat-tile">
                            <div className="stat-label">Holland Baskın Tip</div>
                            <div className="stat-value">
                              {studentData.holland_result?.top1
                                ? `${hollandTypeName(studentData.holland_result.top1)} (${studentData.holland_result.top1})`
                                : 'Henüz test verisi bulunmuyor'}
                            </div>
                          </div>

                          {selectedStudentProfile?.target_department && studentData.holland_result ? (
                            (() => {
                              const analysis = analyzeCompatibility(studentData.holland_result.top1, selectedStudentProfile.target_department);
                              if (analysis) {
                                return (
                                  <div className="chip" style={{ borderColor: analysis.color }}>
                                    <div className="flex-between mb-16">
                                      <strong style={{ color: analysis.color, display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaLightbulb /> Sistem AI Analizi</strong>
                                      <span
                                        className="tag"
                                        style={{ background: analysis.color, color: 'var(--text-on-accent)', borderColor: 'transparent' }}
                                      >
                                        {analysis.status}
                                      </span>
                                    </div>
                                    <div>{analysis.message}</div>
                                  </div>
                                );
                              }
                              return null;
                            })()
                          ) : (
                            <div className="chip text-center">
                              Detaylı uyum analizi için öğrencinin hem hedef meslek seçmesi hem de Holland kariyer testini tamamlaması gerekmektedir.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div className="empty-title">Öğrenci henüz platformda test çözmemiş.</div>
                        </div>
                      )}
                    </div>

                    {/* Koçluk Notları Bölümü */}
                    <div className="panel">
                      <h4 className="panel-title"><FaStickyNote /> Koçluk Notları & Görüşmeler</h4>
                      <textarea
                        placeholder="Öğrenci hakkında özel koçluk notu yazın..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                      />
                      <button className="btn btn-primary btn-sm mt-8" onClick={addTeacherNote}>
                        Notu Kaydet
                      </button>

                      <div className="grid-auto mt-16">
                        {studentNotes.length === 0 ? (
                          <p className="text-muted text-sm text-center">Bu öğrenci için henüz not eklenmemiş.</p>
                        ) : (
                          studentNotes.map((n) => (
                            <div key={n.id} className="chip">
                              <div style={{ whiteSpace: 'pre-wrap' }}>{n.note}</div>
                              <div className="flex-between mt-8 text-faint text-sm">
                                <span>{new Date(n.created_at).toLocaleString('tr-TR')}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => deleteTeacherNote(n.id)}>
                                  <FaTrash /> Sil
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
            <div className="empty-state">
              <div className="empty-icon"><FaClipboardList /></div>
              <h3 className="empty-title">Sınıf Seçilmedi</h3>
              <p className="text-muted">
                Öğrencileri, hedef analizlerini ve koçluk notlarını görüntülemek için sol taraftaki listeden bir sınıf seçin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
