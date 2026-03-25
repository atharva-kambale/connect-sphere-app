const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getPublicProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/:id', getPublicProfile);

module.exports = router;
