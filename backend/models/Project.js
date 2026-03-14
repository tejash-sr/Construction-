import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    clientName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['residential', 'commercial', 'renovation', 'interior', 'infrastructure']
    },
    location: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    completionDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'planning'
    },
    budget: {
      type: Number,
      required: true
    },
    actualCost: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    images: [{
      url: String,
      caption: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    featuredImage: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    testimonial: {
      text: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    teamMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    milestones: [{
      title: String,
      description: String,
      targetDate: Date,
      completedDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      }
    }]
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
