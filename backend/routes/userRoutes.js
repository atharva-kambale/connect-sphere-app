const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getPublicProfile, submitContactForm, subscribeNewsletter } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
router.post('/contact', submitContactForm);
router.post('/subscribe', subscribeNewsletter);

router.get('/:id', getPublicProfile);

module.exports = router;
