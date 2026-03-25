const express = require('express');
const router = express.Router();
const { getListings, getListingById, getFeaturedListings, createListing, updateListingStatus, updateListing, deleteListing } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getListings)
  .post(protect, upload.array('images', 5), createListing);

router.get('/featured', getFeaturedListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, upload.array('images', 5), updateListing)
  .delete(protect, deleteListing);

router.put('/:id/status', protect, updateListingStatus);

module.exports = router;
