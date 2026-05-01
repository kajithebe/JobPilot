import express from 'express';
import {
  getStats,
  getAlerts,
  getChartData,
  getActivities,
} from '../controllers/dashboard.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/stats', getStats);
router.get('/alerts', getAlerts);
router.get('/charts', getChartData);
router.get('/activities', getActivities);

export default router;
