import express from 'express';
import {importFromUrl} from '../controllers/importer.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/url', importFromUrl);

export default router;
