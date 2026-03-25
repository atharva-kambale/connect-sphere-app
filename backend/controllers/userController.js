const User = require('../models/User');
const Listing = require('../models/Listing');
const sendEmail = require('../utils/sendEmail');
const { contactFormEmailTemplate, newsletterSignupTemplate } = require('../utils/emailTemplates');

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

// @desc    Submit contact form and email admin
// @route   POST /api/users/contact
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' });

    await sendEmail({
      email: process.env.EMAIL_FROM || 'admin@connectsphere.tech',
      subject: `New Contact Form Submission from ${name}`,
      message: contactFormEmailTemplate(name, email, message)
    });

    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/users/subscribe
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Assuming we just send a success confirmation for now.
    // Real implementation would save to DB/Resend Audience.
    await sendEmail({
      email,
      subject: 'Welcome to Connect Sphere Updates!',
      message: newsletterSignupTemplate()
    });

    res.json({ message: 'Subscribed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getPublicProfile, submitContactForm, subscribeNewsletter };
