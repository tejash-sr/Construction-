import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser
} from '../controllers/adminController.js';
import {
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote,
  getAIAnalysis
} from '../controllers/quoteController.js';
import {
  getAllMessages,
  getMessageById,
  replyToMessage,
  updateMessageStatus,
  deleteMessage
} from '../controllers/messageController.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublic,
  toggleProjectFeatured
} from '../controllers/projectController.js';
import {
  getSettings,
  updateSettings
} from '../controllers/settingsController.js';
import {
  getAllAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Quotes
router.get('/quotes', getAllQuotes);
router.get('/quotes/:id', getQuoteById);
router.get('/quotes/:id/ai-analysis', getAIAnalysis);
router.put('/quotes/:id/status', updateQuoteStatus);
router.delete('/quotes/:id', deleteQuote);

// Messages
router.get('/messages', getAllMessages);
router.get('/messages/:id', getMessageById);
router.put('/messages/:id/reply', replyToMessage);
router.put('/messages/:id/status', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

// Projects
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.put('/projects/:id/toggle-public', toggleProjectPublic);
router.put('/projects/:id/toggle-featured', toggleProjectFeatured);

// Appointments
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
