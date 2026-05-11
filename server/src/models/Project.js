const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'submitted', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    order: {
      type: Number,
      default: 0,
    },
    submissionFiles: [
      {
        url: String,
        publicId: String,
        name: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    submissionNote: {
      type: String,
      default: '',
    },
    aiReview: {
      score: { type: Number, min: 0, max: 100 },
      feedback: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'needs_revision'],
      },
      reviewedAt: Date,
    },
    clientReview: {
      comment: String,
      approved: Boolean,
      reviewedAt: Date,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: 0,
    },
    timeline: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'draft',
        'open',
        'in_progress',
        'completed',
        'cancelled',
        'disputed',
      ],
      default: 'draft',
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    aiSummary: {
      type: String,
      default: '',
    },
    aiConversation: [
      {
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    milestones: [milestoneSchema],
    escrowAmount: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    proposals: [
      {
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        coverLetter: String,
        bidAmount: Number,
        timeline: String,
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    category: {
      type: String,
      default: '',
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Index for search
projectSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Project', projectSchema);
