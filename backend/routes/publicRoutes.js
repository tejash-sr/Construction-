import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createQuote } from '../controllers/quoteController.js';
import { createContactMessage } from '../controllers/messageController.js';
import { getPublicProjects } from '../controllers/projectController.js';
import { getPublicSettings } from '../controllers/settingsController.js';
import { approveAppointmentViaEmail, cancelAppointmentViaEmail } from '../controllers/appointmentController.js';

const router = express.Router();

// Public routes
router.get('/projects', getPublicProjects);
router.get('/settings', getPublicSettings);
router.post('/messages', createContactMessage);

// Appointment email action routes (no auth required - secured by token)
router.get('/appointments/:id/approve', approveAppointmentViaEmail);
router.get('/appointments/:id/cancel', cancelAppointmentViaEmail);

// Protected routes (logged in users)
router.post('/quotes', protect, createQuote);

export default router;
