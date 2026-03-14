import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAppointmentRequest,
  getUserAppointments,
  getAppointmentById,
  rescheduleAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

// User appointment routes
router.post('/', createAppointmentRequest);
router.get('/my', getUserAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/reschedule', rescheduleAppointment);
router.delete('/:id', deleteAppointment);

export default router;
