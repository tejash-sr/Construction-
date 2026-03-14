import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    projectType: {
      type: String,
      required: true,
      enum: [
        'Residential Construction',
        'Commercial Construction', 
        'Industrial Construction',
        'Electrical Work',
        'Renovation',
        'Interior Design',
        'Other'
      ]
    },
    projectSize: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    budgetRange: {
      type: String,
      required: true
    },
    timeline: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'approved', 'rejected', 'in-progress', 'completed'],
      default: 'pending'
    },
    quotedAmount: {
      type: Number
    },
    quotedDetails: {
      type: String
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    adminNotes: {
      type: String
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
