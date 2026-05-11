const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
      default: '',
    },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      quality: { type: Number, min: 1, max: 5 },
      timeliness: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
    },
    type: {
      type: String,
      enum: ['client_to_freelancer', 'freelancer_to_client'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
