import express from 'express';
import { signup, login, getMe, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/verify', protect, verifyToken);

export default router;
