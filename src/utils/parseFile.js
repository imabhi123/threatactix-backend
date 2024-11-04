
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const parseFile = (filePath, ext) => {
  if (ext === '.xlsx' || ext === '.xls') {
    // Parse Excel file
    const workbook = xlsx.readFile(filePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(firstSheet);
  } else if (ext === '.csv') {
    // Parse CSV file
    return new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
};


// export const parseFile = (filePath, ext) => {
//     let data = [];
  
//     if (ext === '.xlsx' || ext === '.xls') {
//       // Parse Excel file
//       const workbook = xlsx.readFile(filePath);
//       const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//       data = xlsx.utils.sheet_to_json(firstSheet);
//     } else if (ext === '.csv') {
//       // Parse CSV file
//       const rows = [];
//       return new Promise((resolve, reject) => {
//         fs.createReadStream(filePath)
//           .on('error', reject)
//           .pipe(csvParser())
//           .on('data', (row) => {
//             rows.push(row);
//           })
//           .on('end', () => {
//             resolve(rows);
//           });
//       });
//     }
  
//     return Promise.resolve(data); // For Excel, resolve the data directly
//   };