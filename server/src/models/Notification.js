const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'project_created',
        'proposal_received',
        'proposal_accepted',
        'proposal_rejected',
        'milestone_submitted',
        'milestone_approved',
        'milestone_rejected',
        'payment_released',
        'payment_received',
        'new_message',
        'review_received',
        'withdrawal_processed',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
