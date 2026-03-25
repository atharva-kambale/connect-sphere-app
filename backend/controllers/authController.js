const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { welcomeEmailTemplate, otpEmailTemplate, passwordResetEmailTemplate } = require('../utils/emailTemplates');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, university, campus } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    const user = await User.create({ name, email, password, university, campus, otp, otpExpire, isVerified: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Connect Sphere - Verify Your Email',
        message: otpEmailTemplate(otp)
      });
      res.status(201).json({ message: 'User registered. Check email for OTP.', userId: user._id });
    } catch (error) {
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Registration succeeded, but email delivery failed.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Send Welcome Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Connect Sphere!',
        message: welcomeEmailTemplate(user.name)
      });
    } catch (err) {
      console.warn('Welcome email could not be sent', err);
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      campus: user.campus,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Connect Sphere - New Verification OTP',
      message: otpEmailTemplate(otp)
    });

    res.json({ message: 'OTP successfully resent to your inbox' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first', needsVerification: true });
      }
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        university: user.university,
        campus: user.campus,
        avatar: user.avatar,
        reputationScore: user.reputationScore,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Connect Sphere - Password Reset',
      message: passwordResetEmailTemplate(resetUrl)
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOTP, resendOTP, authUser, forgotPassword, resetPassword };
