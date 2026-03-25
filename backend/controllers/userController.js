const User = require('../models/User');
const Listing = require('../models/Listing');

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpire');
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ user, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.campus = req.body.campus || user.campus;
    user.university = req.body.university || user.university;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      campus: updatedUser.campus,
      university: updatedUser.university,
      bio: updatedUser.bio,
      reputationScore: updatedUser.reputationScore,
      avatar: updatedUser.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public profile of any user
// @route   GET /api/users/:id
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name university campus bio reputationScore avatar createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const listings = await Listing.find({ seller: req.params.id, status: 'Active' }).sort({ createdAt: -1 });
    res.json({ user, listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getPublicProfile };
