import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Freelancer from './models/Freelancer.js';

const router = express.Router();

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// REGISTER - Updated to match your frontend form data
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, dob, userType, password, confirmPassword, skills, experience, portfolio } = req.body;

    console.log('Registration attempt:', { name, email, userType });

    // Check if passwords match
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

    // Create user
    const newUser = await User.create({
      name,
      email,
      phone,
      dob,
      userType,
      password,
      skills: userType === 'freelancer' ? skills : '',
      experience: userType === 'freelancer' ? experience : '',
      portfolio: portfolio || ''
    });

    // Generate token
    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to NeonGigs!',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.correctPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is a freelancer and if they're verified
    const freelancer = await Freelancer.findOne({ email });
    if (freelancer) {
      // User is a freelancer, check verification status
      if (!freelancer.canLogin) {
        return res.status(403).json({
          success: false,
          isVerified: false,
          userType: 'freelancer',
          message: 'Your freelancer account is pending verification. Please wait up to 72 hours for admin approval.'
        });
      }
    }

    // Generate token
    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;