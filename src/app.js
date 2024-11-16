// app.js

// Import dependencies
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js'; // MongoDB connection
import errorHandler from './middlewares/errorHandler.js';

// Route imports
// import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// import threatRoutes from './routes/threatRoutes.js';
// import alertRoutes from './routes/alertRoutes.js';
import userRoutes from './routes/user-routes.js'
import incidentRoutes from './routes/incidentRoutes.js'
import promocodeRoutes from './routes/promocodeRoutes.js'
import { Admin } from './models/adminModel.js';
import gatherMoreDetails from './utils/webscrapper.js';
import Plan from './models/planSchema.js';
import { User } from './models/userModel.js';
import planRoutes from './routes/planRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import threatFeedRoutes from './routes/threatFeedRoutes.js'
// import paymentRoutes from './routes/paymentRoutes.js'

// Initialize app
dotenv.config(); // Load environment variables
const app = express();

// Connect to the database
connectDB();

// Security middleware
app.use(helmet());         // Set security-related HTTP headers
app.use(mongoSanitize());  // Sanitize user input to prevent NoSQL injection attacks
app.use(xss());            // Sanitize user input to prevent XSS attacks

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
// app.use(limiter);

// gatherMoreDetails('what is quantum physics')

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors());  // Allow only specific domains
app.use(morgan('dev'));  // Logging middleware

// API routes
app.use('/api/v1/admin', adminRoutes);    // Admin management routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/incident', incidentRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/promo', promocodeRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/threats', threatFeedRoutes);
// app.use('/api/v1/payments', paymentRoutes);

// Custom error handling middleware
app.use(errorHandler);

// Basic home route
app.get('/', (req, res) => {
  res.send('Welcome to the Threat Intelligence Platform API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import xlsx from 'xlsx';
// import csvParser from 'csv-parser';
// import { fileURLToPath } from 'url';

// // Manually define __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 3000;

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     // Ensure the uploads folder exists
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Set unique filename
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// // Function to parse either CSV or Excel file based on extension
// const parseFile = (filePath, ext) => {
//   let data = [];

//   if (ext === '.xlsx' || ext === '.xls') {
//     // Parse Excel file
//     const workbook = xlsx.readFile(filePath);
//     const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//     data = xlsx.utils.sheet_to_json(firstSheet);
//   } else if (ext === '.csv') {
//     // Parse CSV file
//     const rows = [];
//     return new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .on('error', reject)
//         .pipe(csvParser())
//         .on('data', (row) => {
//           rows.push(row);
//         })
//         .on('end', () => {
//           resolve(rows);
//         });
//     });
//   }

//   return Promise.resolve(data); // For Excel, resolve the data directly
// };

// // Route for file upload and processing
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const ext = path.extname(file.originalname).toLowerCase();
//     const validExtensions = ['.xlsx', '.xls', '.csv'];
//     if (!validExtensions.includes(ext)) {
//       return res.status(400).send('Invalid file type. Upload only Excel or CSV files.');
//     }

//     const filePath = path.join(__dirname, 'uploads', file.filename);

//     // Parse the file based on its type
//     const extractedData = await parseFile(filePath, ext);

//     res.status(200).json({
//       message: 'File processed successfully!',
//       data: extractedData,
//     });

//     // Clean up the file after processing
//     fs.unlinkSync(filePath);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error processing file.');
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
