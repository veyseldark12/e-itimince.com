// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvxorpbfimlipmmccjoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12eG9ycGJmaW1saXBtbWNjam9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDMzNjcsImV4cCI6MjEwMDkxOTM2N30.32ZP0eh2lbPlgRGnTGUKV_vEFAO6eDPqXB6sKqSCsR8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test bağlantısı
supabase.auth.getSession().then(({ data, error }) => {
  if (error) console.error('❌ Supabase bağlantı hatası:', error.message);
  else console.log('✅ Supabase bağlantısı başarılı!');
});