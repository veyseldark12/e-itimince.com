// src/utils/exportUtils.js

import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'veriler') => {
  // Veriyi Excel formatına çevir
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sayfa1');
  
  // Excel dosyasını indir
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Örnek kullanım:
// exportToExcel(filteredData, 'siralama-sonuclari');