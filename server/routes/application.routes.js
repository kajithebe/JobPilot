import express from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/application.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
