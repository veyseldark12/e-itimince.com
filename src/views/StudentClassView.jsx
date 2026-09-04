// src/components/StudentClassView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_THEME } from '../constants/theme';
import { FaUsers, FaUserGraduate, FaStickyNote, FaChalkboardTeacher } from 'react-icons/fa';

export function StudentClassView({ userClassId }) {
  const theme = APP_THEME;
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
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: theme.cardBg, borderRadius: '16px', color: '#fff', textAlign: 'center', border: theme.cardBorder }}>
        <h3>⚠️ Henüz bir sınıfa atanmadınız.</h3>
        <p style={{ color: theme.textSecondary, marginTop: '10px' }}>Lütfen öğretmeninizle iletişime geçip sizi bir sınıfa kaydetmesini isteyin.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Sınıf Başlığı */}
      <div style={{ background: theme.cardBg, padding: '24px', borderRadius: '16px', border: theme.cardBorder, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(249,115,22,0.1)', padding: '16px', borderRadius: '12px', color: theme.accentMain, fontSize: '28px' }}>
          <FaUsers />
        </div>
        <div>
          <h2 style={{ color: theme.textPrimary, margin: 0 }}>Sınıfım: {className}</h2>
          <p style={{ color: theme.textSecondary, margin: '4px 0 0 0', fontSize: '14px' }}>Öğretmeninizin sizin için bıraktığı notları ve sınıf arkadaşlarınızı buradan takip edebilirsiniz.</p>
        </div>
      </div>

      {/* Öğretmen Notları / Önerileri Bölümü */}
      <div style={{ background: theme.cardBg, padding: '24px', borderRadius: '16px', border: theme.cardBorder }}>
        <h3 style={{ color: theme.accentMain, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FaStickyNote /> Öğretmen Notları ve Önerileri
        </h3>
        {notes.length === 0 ? (
          <p style={{ color: theme.textSecondary, fontSize: '14px' }}>Henüz öğretmeniniz tarafından eklenmiş bir not veya öneri bulunmuyor.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notes.map((item) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '15px', lineHeight: '1.5' }}>{item.note}</p>
                <span style={{ color: theme.textSecondary, fontSize: '12px' }}>
                  {new Date(item.created_at).toLocaleDateString('tr-TR')} tarihinde eklendi.
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sınıf Arkadaşları Listesi */}
      <div style={{ background: theme.cardBg, padding: '24px', borderRadius: '16px', border: theme.cardBorder }}>
        <h3 style={{ color: theme.accentMain, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FaUserGraduate /> Sınıf Arkadaşları ({classmates.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
        {classmates.map((mate) => (
  <div key={mate.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
    {/* Metin rengini açıkça belirttik */}
    <div style={{ fontWeight: '600', color: theme.textPrimary || '#fff', fontSize: '15px', marginBottom: '6px' }}>
      👤 {mate.name || 'İsimsiz Öğrenci'}
    </div>
    <div style={{ fontSize: '13px', color: theme.textSecondary }}>
      🎯 Hedef: {mate.target_university || 'Belirtilmemiş'} / {mate.target_department || ''}
    </div>
  </div>
))}
        </div>
      </div>

    </div>
  );
}