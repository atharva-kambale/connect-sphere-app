const express = require('express');
const router = express.Router();
const { registerUser, authUser, verifyOTP, resendOTP, forgotPassword, resetPassword } = require('../controllers/authController');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, validateResetPassword, validateOTP } = require('../middleware/validate');

// Auth routes with rate limiting + input validation
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, authUser);
router.post('/verify-otp', authLimiter, validateOTP, verifyOTP);
router.post('/resend-otp', authLimiter, resendOTP);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, validateResetPassword, resetPassword);

module.exports = router;
