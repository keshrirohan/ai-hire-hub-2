const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    milestoneId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'deposit',
        'withdrawal',
        'escrow',
        'release',
        'refund',
        'platform_fee',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'wallet', 'bank_transfer'],
      default: 'wallet',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
