import express from 'express';
import bcrypt from 'bcryptjs';
import Freelancer from '../models/Freelancer.js';
import Service from '../models/Service.js';

const router = express.Router();

// Register new freelancer
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      bio,
      skills,
      category,
      experience,
      portfolio,
      languages,
      hourlyRate,
      location,
      profileImage
    } = req.body;

    // Check if freelancer already exists
    const existingFreelancer = await Freelancer.findOne({ email });
    if (existingFreelancer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Freelancer with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new freelancer with anonymous user placeholder avatar
    const freelancer = new Freelancer({
      name,
      email,
      password: hashedPassword,
      phone,
      bio,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      category,
      experience,
      portfolio,
      languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map(l => l.trim()) : []),
      hourlyRate,
      location,
      profileImage: profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=05d9e8&color=0d0221&size=200&bold=true',
      status: 'pending'
    });

    await freelancer.save();

    res.status(201).json({
      success: true,
      message: 'Freelancer registration submitted successfully! Please wait for admin approval.',
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        email: freelancer.email,
        status: freelancer.status
      }
    });
  } catch (error) {
    console.error('Error registering freelancer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering freelancer', 
      error: error.message 
    });
  }
});

// Get all pending freelancers (for admin)
router.get('/pending', async (req, res) => {
  try {
    const pendingFreelancers = await Freelancer.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .select('-password');

    res.json({
      success: true,
      count: pendingFreelancers.length,
      freelancers: pendingFreelancers
    });
  } catch (error) {
    console.error('Error fetching pending freelancers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pending freelancers', 
      error: error.message 
    });
  }
});

// Get all approved freelancers
router.get('/approved', async (req, res) => {
  try {
    const approvedFreelancers = await Freelancer.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .select('-password');

    res.json({
      success: true,
      count: approvedFreelancers.length,
      freelancers: approvedFreelancers
    });
  } catch (error) {
    console.error('Error fetching approved freelancers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching approved freelancers', 
      error: error.message 
    });
  }
});

// Approve freelancer and create service
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceTitle, serviceDescription, servicePrice, deliveryTime } = req.body;

    const freelancer = await Freelancer.findById(id);

    if (!freelancer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Freelancer not found' 
      });
    }

    if (freelancer.status === 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'Freelancer is already approved' 
      });
    }

    // Update freelancer status and enable login
    freelancer.status = 'approved';
    freelancer.canLogin = true;
    freelancer.verifiedAt = new Date();
    await freelancer.save();

    // Create a service/gig for the approved freelancer with ZERO initial values
    const service = new Service({
      freelancerId: freelancer._id,
      freelancerName: freelancer.name,
      title: serviceTitle || `Professional ${freelancer.category} Services`,
      description: serviceDescription || freelancer.bio || `Expert ${freelancer.category} services by ${freelancer.name}`,
      shortDescription: `${freelancer.skills.slice(0, 3).join(', ')}`,
      category: freelancer.category,
      price: servicePrice || freelancer.hourlyRate || 50,
      deliveryTime: deliveryTime || 7,
      images: [freelancer.profileImage],
      tags: freelancer.skills,
      status: 'active',
      rating: 0,
      totalReviews: 0,
      totalOrders: 0,
      totalEarnings: 0,
      ordersCompleted: 0,
      views: 0
    });

    await service.save();

    res.json({
      success: true,
      message: 'Freelancer approved and service created successfully',
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        email: freelancer.email,
        status: freelancer.status,
        canLogin: freelancer.canLogin
      },
      service: {
        id: service._id,
        title: service.title,
        price: service.price,
        totalEarnings: 0,
        ordersCompleted: 0,
        rating: 0,
        totalReviews: 0
      }
    });
  } catch (error) {
    console.error('Error approving freelancer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error approving freelancer', 
      error: error.message 
    });
  }
});

// Reject freelancer
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const freelancer = await Freelancer.findById(id);

    if (!freelancer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Freelancer not found' 
      });
    }

    freelancer.status = 'rejected';
    await freelancer.save();

    res.json({
      success: true,
      message: 'Freelancer rejected',
      freelancer: {
        id: freelancer._id,
        name: freelancer.name,
        status: freelancer.status
      }
    });
  } catch (error) {
    console.error('Error rejecting freelancer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error rejecting freelancer', 
      error: error.message 
    });
  }
});

// Get freelancer by ID
router.get('/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id).select('-password');

    if (!freelancer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Freelancer not found' 
      });
    }

    // Get freelancer's services to calculate total earnings and stats
    const services = await Service.find({ freelancerId: freelancer._id });
    
    let totalEarnings = 0;
    let totalOrders = 0;
    let totalReviews = 0;
    let averageRating = 0;

    services.forEach(service => {
      totalEarnings += service.totalEarnings || 0;
      totalOrders += service.ordersCompleted || 0;
      totalReviews += service.totalReviews || 0;
      averageRating += (service.rating || 0) * (service.totalReviews || 0);
    });

    if (totalReviews > 0) {
      averageRating = (averageRating / totalReviews).toFixed(1);
    }

    res.json({
      success: true,
      freelancer: {
        ...freelancer.toObject(),
        stats: {
          totalEarnings,
          totalOrders,
          totalReviews,
          averageRating,
          totalServices: services.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching freelancer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching freelancer', 
      error: error.message 
    });
  }
});

export default router;
