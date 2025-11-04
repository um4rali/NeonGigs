import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=05d9e8&color=0d0221&size=200&bold=true'
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  languages: {
    type: [String],
    default: []
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  canLogin: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '1 hour'
  },
  location: {
    type: String,
    default: ''
  },
  memberSince: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

export default Freelancer;
