import Appointment from '../models/Appointment.js';
import {
  createMeetEvent,
  updateMeetEvent,
  deleteMeetEvent,
} from '../utils/googleCalendarService.js';
import {
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendAppointmentCancellationEmail,
  sendAppointmentRescheduledEmail,
  sendAppointmentRequestNotificationToAdmin,
} from '../utils/emailService.js';
import dayjs from 'dayjs';

// @desc    Create appointment request
// @route   POST /api/appointments
// @access  Private (User)
export const createAppointmentRequest = async (req, res) => {
  try {
    const {
      appointmentType,
      relatedQuote,
      relatedProject,
      scheduledDate,
      scheduledTime,
      duration,
      locationType,
      location,
      customerNotes,
    } = req.body;

    // Validate required fields
    if (!appointmentType || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointment type, date, and time',
      });
    }

    // Check if appointment is in the past
    const appointmentDateTime = dayjs(
      `${scheduledDate} ${scheduledTime}`,
      'YYYY-MM-DD h:mm A'
    );
    if (appointmentDateTime.isBefore(dayjs())) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments in the past',
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      appointmentType,
      relatedQuote: relatedQuote || null,
      relatedProject: relatedProject || null,
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      locationType: locationType || 'online',
      location: location || '',
      customerNotes: customerNotes || '',
      status: 'pending',
    });

    await appointment.populate('user', 'name email phone');

    // Send notification email to admin (non-blocking)
    sendAppointmentRequestNotificationToAdmin(appointment, appointment.user).catch(
      (err) => console.error('❌ Email notification error:', err.message || err)
    );

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment request',
      error: error.message,
    });
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/admin/appointments
// @access  Private (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.appointmentType = type;

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('relatedQuote', 'projectType status')
      .populate('relatedProject', 'name status')
      .populate('confirmedBy', 'name')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    // Get stats
    const stats = {
      total: await Appointment.countDocuments(),
      pending: await Appointment.countDocuments({ status: 'pending' }),
      confirmed: await Appointment.countDocuments({ status: 'confirmed' }),
      completed: await Appointment.countDocuments({ status: 'completed' }),
      cancelled: await Appointment.countDocuments({ status: 'cancelled' }),
    };

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message,
    });
  }
};

// @desc    Get user's appointments
// @route   GET /api/appointments/my
// @access  Private (User)
export const getUserAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('relatedQuote', 'projectType status')
      .populate('relatedProject', 'name status')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your appointments',
      error: error.message,
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('relatedQuote', 'projectType status')
      .populate('relatedProject', 'name status')
      .populate('confirmedBy', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if user is authorized
    if (
      appointment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message,
    });
  }
};

// @desc    Update appointment status (admin confirms/cancels/completes)
// @route   PUT /api/admin/appointments/:id/status
// @access  Private (Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const appointment = await Appointment.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    const oldStatus = appointment.status;

    // Update status
    appointment.status = status;
    if (adminNotes) appointment.adminNotes = adminNotes;

    // If confirming, generate meeting link
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      try {
        const meetingData = await createMeetEvent(appointment);
        if (meetingData.success) {
          appointment.meetingLink = meetingData.meetingLink;
          appointment.googleCalendarEventId = meetingData.eventId;
        }
      } catch (error) {
        console.error('Error creating meeting link:', error);
      }

      appointment.confirmedBy = req.user._id;
      appointment.confirmedAt = new Date();

      // Send confirmation email
      sendAppointmentConfirmationEmail(appointment, appointment.user).catch(
        (err) => console.error('Email error:', err)
      );
    }

    // If cancelling, delete calendar event
    if (status === 'cancelled' && appointment.googleCalendarEventId) {
      try {
        await deleteMeetEvent(appointment.googleCalendarEventId);
      } catch (error) {
        console.error('Error deleting calendar event:', error);
      }

      // Send cancellation email
      sendAppointmentCancellationEmail(appointment, appointment.user).catch(
        (err) => console.error('Email error:', err)
      );
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message,
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (User can request, Admin can directly reschedule)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime, duration, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (
      appointment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment',
      });
    }

    // Check if new date is in the past
    const newDateTime = dayjs(
      `${scheduledDate} ${scheduledTime}`,
      'YYYY-MM-DD h:mm A'
    );
    if (newDateTime.isBefore(dayjs())) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments in the past',
      });
    }

    const oldDate = appointment.scheduledDate;
    const oldTime = appointment.scheduledTime;

    appointment.scheduledDate = scheduledDate;
    appointment.scheduledTime = scheduledTime;
    if (duration) appointment.duration = duration;
    appointment.status = 'rescheduled';

    if (reason) {
      appointment.adminNotes = reason;
    }

    // Update calendar event if exists
    if (appointment.googleCalendarEventId) {
      try {
        const updatedEvent = await updateMeetEvent(
          appointment.googleCalendarEventId,
          appointment
        );
        if (updatedEvent.success) {
          appointment.meetingLink = updatedEvent.meetingLink;
        }
      } catch (error) {
        console.error('Error updating calendar event:', error);
      }
    }

    await appointment.save();

    // Send rescheduled email
    sendAppointmentRescheduledEmail(
      appointment,
      appointment.user,
      oldDate,
      oldTime
    ).catch((err) => console.error('Email error:', err));

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment,
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling appointment',
      error: error.message,
    });
  }
};

// @desc    Cancel/Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (User can cancel own, Admin can cancel any)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check authorization
    if (
      appointment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment',
      });
    }

    // Update status to cancelled instead of deleting
    appointment.status = 'cancelled';

    // Delete calendar event if exists
    if (appointment.googleCalendarEventId) {
      try {
        await deleteMeetEvent(appointment.googleCalendarEventId);
      } catch (error) {
        console.error('Error deleting calendar event:', error);
      }
    }

    await appointment.save();

    // Send cancellation email
    sendAppointmentCancellationEmail(appointment, appointment.user).catch(
      (err) => console.error('Email error:', err)
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message,
    });
  }
};

// @desc    Approve appointment via email link
// @route   GET /api/public/appointments/:id/approve
// @access  Public (via secure token)
export const approveAppointmentViaEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    // Verify token matches appointment ID (simple security check)
    const expectedToken = Buffer.from(id).toString('base64');
    if (token !== expectedToken) {
      return res.status(401).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #ef4444;">⚠️ Invalid Link</h1>
            <p>This link is invalid or has expired.</p>
          </body>
        </html>
      `);
    }

    const appointment = await Appointment.findById(id).populate('user', 'name email phone');

    if (!appointment) {
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #ef4444;">❌ Not Found</h1>
            <p>Appointment not found.</p>
          </body>
        </html>
      `);
    }

    if (appointment.status !== 'pending') {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #f59e0b;">⚠️ Already Processed</h1>
            <p>This appointment has already been ${appointment.status}.</p>
          </body>
        </html>
      `);
    }

    // Update appointment to confirmed
    appointment.status = 'confirmed';
    appointment.confirmedAt = new Date();

    // Try to create meeting link
    try {
      const meetingData = await createMeetEvent(appointment);
      if (meetingData.success) {
        appointment.meetingLink = meetingData.meetingLink;
        appointment.googleCalendarEventId = meetingData.eventId;
      }
    } catch (error) {
      console.error('Error creating meeting link:', error);
    }

    await appointment.save();

    // Send confirmation email to user
    sendAppointmentConfirmationEmail(appointment, appointment.user).catch(
      (err) => console.error('Email error:', err)
    );

    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 50px; text-align: center; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #10b981; margin-bottom: 20px; }
            p { color: #666; font-size: 16px; line-height: 1.6; }
            .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #fbbf24; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Appointment Confirmed!</h1>
            <p>The appointment has been successfully confirmed.</p>
            <p><strong>Client:</strong> ${appointment.user.name}</p>
            <p><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${appointment.scheduledTime}</p>
            <p>A confirmation email has been sent to the client.</p>
            <a href="http://localhost:8081/admin/appointments" class="btn">View in Admin Panel</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Approve appointment error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1 style="color: #ef4444;">❌ Error</h1>
          <p>Failed to approve appointment. Please try again.</p>
        </body>
      </html>
    `);
  }
};

// @desc    Cancel appointment via email link
// @route   GET /api/public/appointments/:id/cancel
// @access  Public (via secure token)
export const cancelAppointmentViaEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    // Verify token matches appointment ID (simple security check)
    const expectedToken = Buffer.from(id).toString('base64');
    if (token !== expectedToken) {
      return res.status(401).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #ef4444;">⚠️ Invalid Link</h1>
            <p>This link is invalid or has expired.</p>
          </body>
        </html>
      `);
    }

    const appointment = await Appointment.findById(id).populate('user', 'name email phone');

    if (!appointment) {
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #ef4444;">❌ Not Found</h1>
            <p>Appointment not found.</p>
          </body>
        </html>
      `);
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1 style="color: #f59e0b;">⚠️ Already Cancelled</h1>
            <p>This appointment has already been cancelled.</p>
          </body>
        </html>
      `);
    }

    // Update appointment to cancelled
    appointment.status = 'cancelled';

    // Delete calendar event if exists
    if (appointment.googleCalendarEventId) {
      try {
        await deleteMeetEvent(appointment.googleCalendarEventId);
      } catch (error) {
        console.error('Error deleting calendar event:', error);
      }
    }

    await appointment.save();

    // Send cancellation email to user
    sendAppointmentCancellationEmail(appointment, appointment.user).catch(
      (err) => console.error('Email error:', err)
    );

    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 50px; text-align: center; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #ef4444; margin-bottom: 20px; }
            p { color: #666; font-size: 16px; line-height: 1.6; }
            .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #fbbf24; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Appointment Cancelled</h1>
            <p>The appointment has been cancelled.</p>
            <p><strong>Client:</strong> ${appointment.user.name}</p>
            <p><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${appointment.scheduledTime}</p>
            <p>A cancellation email has been sent to the client.</p>
            <a href="http://localhost:8081/admin/appointments" class="btn">View in Admin Panel</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1 style="color: #ef4444;">❌ Error</h1>
          <p>Failed to cancel appointment. Please try again.</p>
        </body>
      </html>
    `);
  }
};
