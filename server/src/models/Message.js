const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['text', 'file', 'image', 'system'],
      default: 'text',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
