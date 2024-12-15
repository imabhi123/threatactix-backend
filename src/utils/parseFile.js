// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import xlsx from 'xlsx';
// import csvParser from 'csv-parser';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// export const parseFile = (filePath, ext) => {
//   if (ext === '.xlsx' || ext === '.xls') {
//     // Parse Excel file
//     const workbook = xlsx.readFile(filePath);
//     const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//     return xlsx.utils.sheet_to_json(firstSheet);
//   } else if (ext === '.csv') {
//     // Parse CSV file
//     return new Promise((resolve, reject) => {
//       const rows = [];
//       fs.createReadStream(filePath)
//         .pipe(csvParser())
//         .on('data', (row) => rows.push(row))
//         .on('end', () => resolve(rows))
//         .on('error', reject);
//     });
//   }
// };

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to check if a value is a number
const isNumber = (value) => !isNaN(value) && typeof value === 'number';

// Helper function to process Excel dates
const excelDateToJSDate = (serial) => {
  const excelEpoch = new Date(Date.UTC(1900, 0, 1));
  return new Date(excelEpoch.getTime() + (serial - 1) * 86400 * 1000).toISOString().split('T')[0];
};

export const parseFile = (filePath, ext) => {
  if (ext === '.xlsx' || ext === '.xls') {
    // Parse Excel file
    const workbook = xlsx.readFile(filePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(firstSheet);

    // Process data to convert numeric fields to strings
    return jsonData.map((row) => {
      const processedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (isNumber(value)&&(key=="Date Updated"||key=="Month") && value > 10000) {
          // Assuming large numbers are dates
          processedRow[key] = excelDateToJSDate(value);
        } else if (isNumber(value)) {
          processedRow[key] = value.toString(); // Convert other numbers to strings
        } else {
          processedRow[key] = value;
        }
      }
      return processedRow;
    });
  } else if (ext === '.csv') {
    // Parse CSV file
    return new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Convert numeric values to strings in CSV rows
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = isNumber(value) ? value.toString() : value;
          }
          rows.push(processedRow);
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
};
