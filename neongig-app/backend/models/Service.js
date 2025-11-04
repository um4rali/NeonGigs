import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  freelancerName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    type: Number,
    default: 7 // days
  },
  images: {
    type: [String],
    default: ['https://via.placeholder.com/400x300']
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  ordersCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
serviceSchema.index({ category: 1, rating: -1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ freelancerId: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
