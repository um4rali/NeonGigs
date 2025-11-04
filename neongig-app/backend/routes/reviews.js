import express from 'express';
import Review from '../models/Review.js';
import Service from '../models/Service.js';
import Freelancer from '../models/Freelancer.js';

const router = express.Router();

// Get reviews for a specific service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const reviews = await Review.find({ serviceId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews', 
      error: error.message 
    });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { serviceId, freelancerId, userId, userName, userImage, rating, comment } = req.body;

    // Validate required fields
    if (!serviceId || !freelancerId || !userId || !userName || !rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Create review
    const review = new Review({
      serviceId,
      freelancerId,
      userId,
      userName,
      userImage: userImage || 'https://via.placeholder.com/50',
      rating,
      comment
    });

    await review.save();

    // Update service rating
    const allReviews = await Review.find({ serviceId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = (totalRating / allReviews.length).toFixed(1);

    service.rating = parseFloat(avgRating);
    service.totalReviews = allReviews.length;
    await service.save();

    // Update freelancer rating
    const freelancer = await Freelancer.findById(freelancerId);
    if (freelancer) {
      const freelancerReviews = await Review.find({ freelancerId });
      const freelancerTotalRating = freelancerReviews.reduce((sum, rev) => sum + rev.rating, 0);
      const freelancerAvgRating = (freelancerTotalRating / freelancerReviews.length).toFixed(1);

      freelancer.rating = parseFloat(freelancerAvgRating);
      freelancer.totalReviews = freelancerReviews.length;
      await freelancer.save();
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating review', 
      error: error.message 
    });
  }
});

// Get all reviews for a freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const reviews = await Review.find({ freelancerId })
      .sort({ createdAt: -1 })
      .populate('serviceId', 'title');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching freelancer reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching freelancer reviews', 
      error: error.message 
    });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Update service rating after deletion
    const service = await Service.findById(review.serviceId);
    if (service) {
      const allReviews = await Review.find({ serviceId: review.serviceId });
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const avgRating = (totalRating / allReviews.length).toFixed(1);
        service.rating = parseFloat(avgRating);
        service.totalReviews = allReviews.length;
      } else {
        service.rating = 0;
        service.totalReviews = 0;
      }
      await service.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting review', 
      error: error.message 
    });
  }
});

export default router;
