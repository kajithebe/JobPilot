import express from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getPrepTopics,
  createPrepTopic,
  updatePrepTopic,
  deletePrepTopic,
  checkInInterview,
  getPendingCheckIns,
} from '../controllers/interview.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

// pending-checkin must be before /:id to avoid route conflict
router.get('/pending-checkin', getPendingCheckIns);

router.post('/', createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);
router.post('/:id/checkin', checkInInterview);
router.get('/:id/prep-topics', getPrepTopics);
router.post('/:id/prep-topics', createPrepTopic);
router.patch('/:id/prep-topics/:topicId', updatePrepTopic);
router.delete('/:id/prep-topics/:topicId', deletePrepTopic);

export default router;
