import express from 'express';
import Service from '../models/Service.js';
import Review from '../models/Review.js';

const router = express.Router();

// Get all services with filters
router.get('/', async (req, res) => {
  try {
    const { filter, category, limit } = req.query;
    
    let query = { status: 'active' };
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    let services;

    switch (filter) {
      case 'featured':
        services = await Service.find(query)
          .sort({ isFeatured: -1, rating: -1 })
          .limit(parseInt(limit) || 20);
        break;
      
      case 'popular':
        services = await Service.find(query)
          .sort({ totalOrders: -1, rating: -1 })
          .limit(parseInt(limit) || 20);
        break;
      
      case 'new':
        services = await Service.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit) || 6);
        break;
      
      case 'all':
      default:
        services = await Service.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit) || 20);
        break;
    }

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching services', 
      error: error.message 
    });
  }
});

// Get recent services (for "New" section)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const recentServices = await Service.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('freelancerId', 'name profileImage rating');

    res.json({
      success: true,
      count: recentServices.length,
      services: recentServices
    });
  } catch (error) {
    console.error('Error fetching recent services:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching recent services', 
      error: error.message 
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancerId', 'name profileImage rating bio skills');

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Increment views
    service.views += 1;
    await service.save();

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service', 
      error: error.message 
    });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating service', 
      error: error.message 
    });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating service', 
      error: error.message 
    });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting service', 
      error: error.message 
    });
  }
});

export default router;
