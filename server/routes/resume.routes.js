import express from 'express';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  createVersion,
  getVersions,
} from '../controllers/resume.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// All resume routes are protected
router.use(verifyToken);

router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/versions', createVersion);
router.get('/:id/versions', getVersions);

export default router;
