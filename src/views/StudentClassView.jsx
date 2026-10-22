// src/views/StudentClassView.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaUserGraduate, FaStickyNote, FaUser, FaBullseye, FaExclamationTriangle } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';

export function StudentClassView({ userClassId }) {
  const [className, setClassName] = useState('');
  const [classmates, setClassmates] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!userClassId) {
        setLoading(false);
        return;
      }

      // 1. Sınıf adını çek
      const { data: classData } = await supabase
        .from('classes')
        .select('name')
        .eq('id', userClassId)
        .single();
      if (classData) setClassName(classData.name);

      // 2. Aynı sınıftaki öğrencileri çek
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, name, target_university, target_department')
        .eq('class_id', userClassId)
        .eq('role', 'student');
      if (studentsData) setClassmates(studentsData);

      // 3. Giriş yapan öğrencinin özel notlarını/önerilerini çek
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: notesData } = await supabase
          .from('student_notes')
          .select('id, note, created_at')
          .eq('student_id', user.id);
        if (notesData) setNotes(notesData);
      }

      setLoading(false);
    };

    fetchClassData();
  }, [userClassId]);

  if (!userClassId) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><FaExclamationTriangle /></div>
        <h3 className="empty-title">Henüz bir sınıfa atanmadınız.</h3>
        <p className="text-muted">
          Lütfen öğretmeninizle iletişime geçip sizi bir sınıfa kaydetmesini isteyin.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-title">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="animate-up">
      <PageHeader
        kicker="Sınıfım"
        title={`Sınıfım: ${className}`}
        desc="Öğretmeninizin sizin için bıraktığı notları ve sınıf arkadaşlarınızı buradan takip edebilirsiniz."
      />

      {/* Öğretmen Notları / Önerileri Bölümü */}
      <div className="panel mb-24">
        <h3 className="panel-title">
          <FaStickyNote /> Öğretmen Notları ve Önerileri
        </h3>
        {notes.length === 0 ? (
          <p className="text-muted text-sm">
            Henüz öğretmeniniz tarafından eklenmiş bir not veya öneri bulunmuyor.
          </p>
        ) : (
          <div className="grid-auto">
            {notes.map((item) => (
              <div key={item.id} className="chip">
                <div>{item.note}</div>
                <div className="text-faint text-sm mt-8">
                  {new Date(item.created_at).toLocaleDateString('tr-TR')} tarihinde eklendi.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sınıf Arkadaşları Listesi */}
      <div className="panel">
        <h3 className="panel-title">
          <FaUserGraduate /> Sınıf Arkadaşları ({classmates.length})
        </h3>
        <div className="grid-auto grid-3">
          {classmates.map((mate) => (
            <div key={mate.id} className="chip">
              <div className="td-strong">
                <span className="meta-item"><FaUser /> {mate.name || 'İsimsiz Öğrenci'}</span>
              </div>
              <div className="text-muted text-sm mt-8">
                <span className="meta-item"><FaBullseye /> Hedef: {mate.target_university || 'Belirtilmemiş'} / {mate.target_department || ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
