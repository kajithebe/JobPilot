import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences,
  deleteAccount,
} from '../controllers/user.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.put('/preferences', updatePreferences);
router.delete('/me', deleteAccount);

export default router;
