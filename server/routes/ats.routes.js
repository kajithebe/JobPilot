import express from 'express';
import {getAtsScore} from '../controllers/ats.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/score', getAtsScore);

export default router;
