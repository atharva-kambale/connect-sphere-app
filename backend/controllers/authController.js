const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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
        message: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
          <h2 style="color:#3b82f6;text-align:center;">Welcome to Connect Sphere!</h2>
          <p style="color:#374151;text-align:center;">Your verification code is:</p>
          <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e40af;">${otp}</span>
          </div>
          <p style="color:#6b7280;text-align:center;font-size:14px;">This code expires in 10 minutes.</p>
        </div>`
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
      message: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#3b82f6;text-align:center;">New OTP Code</h2>
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e40af;">${otp}</span>
        </div>
        <p style="color:#6b7280;text-align:center;font-size:14px;">This code expires in 10 minutes.</p>
      </div>`
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
      message: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#3b82f6;text-align:center;">Password Reset</h2>
        <p style="color:#374151;text-align:center;">Click the button below to reset your password. This link expires in <strong>30 minutes</strong>.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;text-decoration:none;padding:14px 32px;border-radius:9999px;font-weight:700;font-size:16px;">Reset My Password</a>
        </div>
        <p style="color:#6b7280;text-align:center;font-size:13px;">If the button doesn't work, copy this link:</p>
        <p style="text-align:center;font-size:12px;word-break:break-all;color:#6366f1;">${resetUrl}</p>
        <p style="color:#9ca3af;text-align:center;font-size:12px;margin-top:20px;">If you didn't request this, you can safely ignore this email.</p>
      </div>`
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
