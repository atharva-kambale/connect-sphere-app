const User = require('../models/User');
const Listing = require('../models/Listing');
const sendEmail = require('../utils/sendEmail');
const { Resend } = require('resend');
const { contactFormEmailTemplate, newsletterSignupTemplate } = require('../utils/emailTemplates');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send to ADMIN_EMAIL (the owner's personal inbox), NOT EMAIL_FROM (the Resend sender)
    const adminEmail = process.env.ADMIN_EMAIL || 'atharvakambale33@gmail.com';
    await sendEmail({
      email: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      message: contactFormEmailTemplate(name, email, message)
    });

    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter — adds contact to Resend Audience for broadcasts
// @route   POST /api/users/subscribe
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      // Add the contact to the Resend Audience for broadcasts
      const { data, error } = await resend.contacts.create({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        unsubscribed: false,
        audienceId,
      });

      if (error) {
        console.error('Resend Contacts API Error:', error);
        // If error is "contact already exists", treat as success
        if (error.message && error.message.includes('already exists')) {
          return res.json({ message: 'You are already subscribed!' });
        }
        return res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
      }

      console.log('✅ Contact added to Resend Audience:', data);
    } else {
      console.warn('⚠️  RESEND_AUDIENCE_ID not set. Skipping Audience registration.');
    }

    // Send a beautiful confirmation email
    await sendEmail({
      email,
      subject: 'Welcome to Connect Sphere Updates!',
      message: newsletterSignupTemplate()
    });

    res.json({ message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getPublicProfile, submitContactForm, subscribeNewsletter };

