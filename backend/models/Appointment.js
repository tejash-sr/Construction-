import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    appointmentType: {
      type: String,
      enum: [
        'Initial Consultation',
        'Site Visit',
        'Progress Review',
        'Final Walkthrough',
      ],
      required: [true, 'Please provide appointment type'],
    },
    relatedQuote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      default: null,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Please provide scheduled date'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Please provide scheduled time'],
      validate: {
        validator: function (v) {
          return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(v);
        },
        message: 'Time must be in format HH:MM AM/PM',
      },
    },
    duration: {
      type: Number,
      enum: [30, 60, 90, 120],
      default: 60,
      required: [true, 'Please provide duration'],
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'completed',
        'cancelled',
        'rescheduled',
        'no-show',
      ],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    googleCalendarEventId: {
      type: String,
      default: '',
    },
    locationType: {
      type: String,
      enum: ['online', 'site', 'office'],
      default: 'online',
      required: [true, 'Please provide location type'],
    },
    location: {
      type: String,
      default: '',
    },
    customerNotes: {
      type: String,
      maxlength: [1000, 'Notes cannot be more than 1000 characters'],
      default: '',
    },
    adminNotes: {
      type: String,
      maxlength: [1000, 'Admin notes cannot be more than 1000 characters'],
      default: '',
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    remindersSent: [
      {
        sentAt: {
          type: Date,
          required: true,
        },
        type: {
          type: String,
          enum: ['24h', '1h', 'custom'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ user: 1, scheduledDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ scheduledDate: 1 });

export default mongoose.model('Appointment', appointmentSchema);
