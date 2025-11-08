import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables FIRST before any other imports
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔍 Environment Variables Check:');
console.log('   RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'NOT LOADED');
console.log('   RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'EXISTS' : 'NOT LOADED');

// Import models
import Freelancer from './models/Freelancer.js';

// Import routes
import freelancerRoutes from './routes/freelancers.js';
import serviceRoutes from './routes/services.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/payment.js';

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'https://neongigs.vercel.app',   // <-- your final Vercel URL
  credentials: true
}));


app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔗 MongoDB Atlas Connection');
console.log('============================');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

console.log('🔄 Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('🎉 SUCCESS: Connected to MongoDB Atlas!');
  console.log('📍 Cluster: cluster0.pahxd7w.mongodb.net');
  console.log('💾 Database: neongigs');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
});

// User Schema with Security
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
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
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
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Won't be included in queries by default
  },
  skills: { 
    type: String, 
    default: '' 
  },
  experience: { 
    type: String, 
    default: '' 
  },
  portfolio: { 
    type: String, 
    default: '' 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// ==================== ROUTES ====================

// Test route
app.get('/api/test', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'Backend is running!',
    database: dbStatus,
    mongodb: {
      cluster: 'cluster0.pahxd7w.mongodb.net',
      database: 'neongigs',
      connected: dbStatus === 'connected'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  let dbPing = 'unknown';
  if (dbStatus === 'connected') {
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = 'healthy';
    } catch (error) {
      dbPing = 'unhealthy';
    }
  }
  
  res.json({
    status: 'OK',
    server: 'running',
    database: {
      status: dbStatus,
      ping: dbPing
    },
    timestamp: new Date().toISOString()
  });
});

// REGISTER - Save to MongoDB with hashed password
app.post('/api/auth/register', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected. Please try again.'
      });
    }

    const { name, email, phone, dob, userType, password, confirmPassword, skills, experience, portfolio } = req.body;
    
    console.log('📝 New registration:', name, email);

    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (password will be auto-hashed by the pre-save hook)
    const newUser = await User.create({
      name,
      email,
      phone,
      dob: new Date(dob),
      userType,
      password, // This will be automatically hashed
      skills: userType === 'freelancer' ? skills : '',
      experience: userType === 'freelancer' ? experience : '',
      portfolio: portfolio || ''
    });

    console.log('✅ User saved to MongoDB Atlas:', newUser._id);

    res.json({
      success: true,
      message: 'Registration successful! Welcome to NeonGigs!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        phone: newUser.phone,
        skills: newUser.skills,
        experience: newUser.experience,
        portfolio: newUser.portfolio,
        isLoggedIn: true
      },
      token: 'jwt-token-' + Date.now()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// LOGIN - Check against MongoDB with hashed passwords
app.post('/api/auth/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected. Please try again.'
      });
    }

    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Find user and include password for verification
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password using bcrypt
    const isPasswordValid = await user.correctPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If user is a freelancer, check verification status
    if (user.userType === 'freelancer') {
      const freelancer = await Freelancer.findOne({ email: user.email });
      
      if (freelancer && !freelancer.canLogin) {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending verification. Please wait up to 72 hours for admin approval.',
          isVerified: false,
          userType: 'freelancer',
          status: freelancer.status
        });
      }
    }

    console.log('✅ Login successful:', user._id);

    res.json({
      success: true,
      message: 'Login successful! Welcome back!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        skills: user.skills,
        experience: user.experience,
        portfolio: user.portfolio,
        isLoggedIn: true
      },
      token: 'jwt-token-' + Date.now()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all users (clean format without passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get users with passwords (for admin only)
app.get('/api/users/debug', async (req, res) => {
  try {
    const users = await User.find().select('+password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete all users (for cleanup)
app.delete('/api/users', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add these routes after your existing routes

// Get user profile
app.get('/api/users/profile', async (req, res) => {
  try {
    // In a real app, you'd verify JWT token here
    const userId = req.query.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile
app.put('/api/users/profile', async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;
    const userId = req.query.userId; // In real app, get from JWT
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, bio, skills },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// Add these updated profile routes to your server.js

// Get user profile - UPDATED
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile - UPDATED
app.put('/api/users/profile', async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email, 
        bio: bio || '', 
        skills: skills || '' 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add logout route
app.post('/api/auth/logout', async (req, res) => {
  try {
    // In a real app, you might blacklist the token here
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== API ROUTES ====================

// Use imported routes
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 NeonGigs Backend Server Started`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📊 Available Endpoints:`);
  console.log(`   Health:       http://localhost:${PORT}/api/health`);
  console.log(`   Test:         http://localhost:${PORT}/api/test`);
  console.log(`   Users:        http://localhost:${PORT}/api/users`);
  console.log(`   Debug:        http://localhost:${PORT}/api/users/debug`);
  console.log(`   Freelancers:  http://localhost:${PORT}/api/freelancers`);
  console.log(`   Services:     http://localhost:${PORT}/api/services`);
  console.log(`   Reviews:      http://localhost:${PORT}/api/reviews`);
  console.log(`\n🔐 Security: Passwords are now hashed!`);
});
