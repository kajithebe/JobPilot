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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/import', importerRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({status: 'ok', message: 'JobPilot API is running'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startInterviewCron();
