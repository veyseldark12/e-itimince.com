// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase bağlantı bilgileri eksik. Proje kökündeki .env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalıdır.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test bağlantısı
supabase.auth.getSession().then(({ error }) => {
  if (error) console.error('Supabase bağlantı hatası:', error.message);
});
