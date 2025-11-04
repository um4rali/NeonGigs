import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: 'https://via.placeholder.com/50'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ serviceId: 1, createdAt: -1 });
reviewSchema.index({ freelancerId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
