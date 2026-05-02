import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import atsRoutes from './routes/ats.routes.js';
import applicationRoutes from './routes/application.routes.js';
import importerRoutes from './routes/importer.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import {startInterviewCron} from './jobs/interviewCron.js';
import {startEmailReminderCron} from './jobs/emailReminder.js';
import pdfRoutes from './routes/pdf.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import rateLimit from 'express-rate-limit';
import {sanitizeBody} from './middleware/sanitize.middleware.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(sanitizeBody);

// Rate limiting — auth endpoints only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {error: 'Too many requests, please try again later'},
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/import', importerRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', pdfRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({status: 'ok', message: 'JobPilot API is running'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startInterviewCron();
startEmailReminderCron();
