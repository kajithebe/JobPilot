import express from 'express';
import {register, login, logout} from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import {validate} from '../middleware/validate.middleware.js';
import {
  registerValidation,
  loginValidation,
} from '../middleware/validators/auth.validators.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/logout', verifyToken, logout);

export default router;
