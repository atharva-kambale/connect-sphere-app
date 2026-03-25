const Review = require('../models/Review');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a review for a seller
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { reviewee, listing, rating, comment } = req.body;

    if (req.user._id.toString() === reviewee) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    const existing = await Review.findOne({ reviewer: req.user._id, reviewee, listing });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this seller for this listing' });

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      listing,
      rating,
      comment
    });

    // Update seller reputation score (average of all review ratings)
    const reviews = await Review.find({ reviewee });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(reviewee, { reputationScore: Math.round(avgRating * 20) }); // Scale 0-100

    // Send notification
    await Notification.create({
      user: reviewee,
      type: 'review',
      title: 'New Review',
      message: `${req.user.name} left you a ${rating}-star review`,
      link: `/profile/${reviewee}`
    });

    const populated = await review.populate('reviewer', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviewsForUser };
