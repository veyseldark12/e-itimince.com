// src/views/StudentProfileView.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PROFESSIONS_DATABASE } from '../constants/professionsData';
import { PageHeader } from '../components/PageHeader';
import { FaUser } from 'react-icons/fa';

export function StudentProfileView() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    target_university: '',
    target_department: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('name, bio, target_university, target_department')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        bio: profile.bio,
        target_university: profile.target_university,
        target_department: profile.target_department
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Güncelleme başarısız: ' + error.message);
    } else {
      setMessage('Profil başarıyla güncellendi!');
    }
    setLoading(false);
  };

  return (
    <div className="animate-up">
      <PageHeader
        icon={FaUser}
        kicker="Profil"
        title="Profilim & Hedeflerim"
        desc="Kişisel bilgilerini ve hedeflediğin üniversite ile mesleği güncel tut."
      />

      {message && (
        <div
          className="note"
          style={{ color: message.includes('başarıyla') ? 'var(--success)' : 'var(--danger)' }}
        >
          {message}
        </div>
      )}

      <form onSubmit={updateProfile} className="panel panel-lg mt-16 grid-auto">
        <div className="field">
          <label className="field-label">Ad Soyad</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field-label">Hedef Üniversite</label>
          <input
            type="text"
            value={profile.target_university || ''}
            onChange={(e) => setProfile({ ...profile, target_university: e.target.value })}
            placeholder="Örn: Boğaziçi Üniversitesi"
          />
        </div>

        <div className="field">
          <label className="field-label">Hedef Meslek / Bölüm</label>
          <select
            value={profile.target_department || ''}
            onChange={(e) => setProfile({ ...profile, target_department: e.target.value })}
          >
            <option value="">-- Hedef Meslek Seçin --</option>
            {PROFESSIONS_DATABASE.map((prof, index) => (
              <option key={index} value={prof.name}>
                {prof.name} ({prof.type})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">Kendinden Bahset (Öğretmenin Görecek)</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
