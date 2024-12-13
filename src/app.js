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
import planRoutes from './routes/planRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import threatFeedRoutes from './routes/threatFeedRoutes.js'
// import paymentRoutes from './routes/paymentRoutes.js'
import malwareRoutes from './routes/malwareRoutes.js'
import authRoutes from './routes/authRoutes.js'
import victimRoutes from './routes/victimsRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

// Initialize app
dotenv.config(); // Load environment variables
const app = express();

// Connect to the database
connectDB();

// Security middleware
app.use(helmet());         // Set security-related HTTP headers
app.use(mongoSanitize());  // Sanitize user input to prevent NoSQL injection attacks
app.use(xss());            // Sanitize user input to prevent XSS attacks
app.use(express.json({ limit: '10mb' })); // Increase payload size limit if needed
// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
// app.use(limiter);

// gatherMoreDetails('what is quantum physics')

// Middleware
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
app.use('/api/v1/malware', malwareRoutes);
app.use('/api/v1/victim', victimRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notification', notificationRoutes);

// Custom error handling middleware
app.use(errorHandler);

// Basic home route
app.get('/', (req, res) => {
  res.send('Welcome to the Threat Intelligence Platform API');
});

// Start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
