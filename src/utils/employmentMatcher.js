// src/utils/employmentMatcher.js

import { bachelorEmploymentData } from '../data/employmentData';
import { associateEmploymentData } from '../data/employmentData';

// Bölüm adını temizle (parantez içi, burslu/ücretli/indirimli vb.)
const cleanDepartmentName = (name) => {
  return name
    .replace(/\(.*?\)/g, '') // Parantez içini kaldır
    .replace(/%50 İndirimli|Burslu|Ücretli|İngilizce|Türkçe/g, '')
    .replace(/Mühendisliği/g, 'Mühendisliği')
    .trim();
};

// Bölüm için istihdam verisi bul
export const getEmploymentData = (departmentName, type = 'Lisans') => {
  const cleanedName = cleanDepartmentName(departmentName);
  const dataSource = type === 'Ön Lisans' ? associateEmploymentData : bachelorEmploymentData;
  
  // 1. Birebir eşleşme
  if (dataSource[cleanedName]) {
    return { rate: dataSource[cleanedName].rate2025, type };
  }
  
  // 2. Anahtar kelime eşleşmesi
  for (const [key, value] of Object.entries(dataSource)) {
    if (key.includes(cleanedName) || cleanedName.includes(key)) {
      return { rate: value.rate2025, type };
    }
  }
  
  // 3. Kısmi eşleşme (örnek: "Bilgisayar Mühendisliği" -> "Bilgisayar")
  const keywords = cleanedName.split(' ');
  for (const [key, value] of Object.entries(dataSource)) {
    for (const kw of keywords) {
      if (kw.length > 3 && key.includes(kw)) {
        return { rate: value.rate2025, type };
      }
    }
  }
  
  return null;
};

// Toplu eşleştirme (tüm bölümler için)
export const matchAllDepartments = (departments) => {
  return departments.map(dept => {
    const employment = getEmploymentData(dept.name, dept.type === 'Ön Lisans' ? 'Ön Lisans' : 'Lisans');
    return {
      ...dept,
      employmentRate: employment?.rate || null,
      employmentType: employment?.type || null,
    };
  });
};