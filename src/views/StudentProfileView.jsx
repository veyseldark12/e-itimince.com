// src/views/StudentProfileView.jsx (veya senin dosya yolun)

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_THEME } from '../constants/theme';
import { PROFESSIONS_DATABASE } from '../constants/professionsData';

export function StudentProfileView() {
  const theme = APP_THEME;
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
      setMessage('❌ Güncelleme başarısız: ' + error.message);
    } else {
      setMessage('✅ Profil başarıyla güncellendi!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: theme.cardBg, padding: '30px', borderRadius: '16px', border: theme.cardBorder }}>
      <h2 style={{ color: theme.accentMain, marginBottom: '20px' }}>👤 Profilim & Hedeflerim</h2>
      
      {message && <div style={{ marginBottom: '15px', color: message.includes('✅') ? '#10b981' : '#ef4444' }}>{message}</div>}

      <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>Ad Soyad</label>
          <input 
            type="text" 
            value={profile.name || ''} 
            onChange={(e) => setProfile({...profile, name: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
          />
        </div>
        
        <div>
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>Hedef Üniversite</label>
          <input 
            type="text" 
            value={profile.target_university || ''} 
            onChange={(e) => setProfile({...profile, target_university: e.target.value})} 
            placeholder="Örn: Boğaziçi Üniversitesi"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
          />
        </div>

        <div>
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>Hedef Meslek / Bölüm</label>
          <select 
            value={profile.target_department || ''} 
            onChange={(e) => setProfile({...profile, target_department: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', outline: 'none' }}
          >
            <option value="">-- Hedef Meslek Seçin --</option>
            {PROFESSIONS_DATABASE.map((prof, index) => (
              <option key={index} value={prof.name}>
                {prof.name} ({prof.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>Kendinden Bahset (Öğretmenin Görecek)</label>
          <textarea 
            value={profile.bio || ''} 
            onChange={(e) => setProfile({...profile, bio: e.target.value})} 
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px', background: theme.accentMain, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}