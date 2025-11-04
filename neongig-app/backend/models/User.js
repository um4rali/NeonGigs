import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  userType: {
    type: String,
    enum: ['buyer', 'freelancer'],
    default: 'buyer'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  skills: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5+', ''],
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // For demo purposes, we'll use a simple hash
    // In production, use proper bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);