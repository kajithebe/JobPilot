import express from 'express';
import {exportResumePDF} from '../controllers/pdf.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/:id/export/pdf', exportResumePDF);

export default router;
