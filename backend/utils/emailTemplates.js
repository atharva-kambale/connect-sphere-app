const generateEmailLayout = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect Sphere</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      color: #334155;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      padding: 32px 40px;
      text-align: left;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    }
    .otp-box {
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 32px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #0f172a;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Connect Sphere</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Connect Sphere. Student Academic Project.</p>
        <p>This email was sent from your campus marketplace platform.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

exports.welcomeEmailTemplate = (name) => {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Welcome to Connect Sphere, ${name}! 🎉</h2>
    <p>We're thrilled to have you join our specialized campus marketplace. Connect Sphere is designed to help students like you trade, connect, and thrive.</p>
    <p>Here are a few things you can do to get started:</p>
    <ul>
      <li><strong>Complete your profile:</strong> Add your avatar and bio.</li>
      <li><strong>Browse listings:</strong> See what fellow students are offering.</li>
      <li><strong>Post an item:</strong> Have textbooks or gear you don't need? List them!</li>
    </ul>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/browse" class="btn">Start Exploring</a>
  `;
  return generateEmailLayout(content);
};

exports.otpEmailTemplate = (otp) => {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Verify your email address</h2>
    <p>Thank you for signing up for Connect Sphere. To complete your registration and secure your account, please enter the one-time password (OTP) below.</p>
    <div class="otp-box">
      <p class="otp-code">${otp}</p>
    </div>
    <p><em>This code will expire in 10 minutes.</em> If you didn't request this code, you can safely ignore this email.</p>
  `;
  return generateEmailLayout(content);
};

exports.passwordResetEmailTemplate = (resetUrl) => {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Reset your password</h2>
    <p>We received a request to reset your password for your Connect Sphere account. Click the button below to choose a new password.</p>
    <a href="${resetUrl}" class="btn" style="display: block; text-align: center;">Reset Password</a>
    <p style="margin-top: 32px;">Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #3b82f6;"><a href="${resetUrl}">${resetUrl}</a></p>
    <p><em>This link will expire in 15 minutes.</em> If you didn't request this, please ignore this email.</p>
  `;
  return generateEmailLayout(content);
};

exports.contactFormEmailTemplate = (name, email, message) => {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">New Contact Form Submission</h2>
    <p>You have received a new message from the Connect Sphere contact form.</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 30%;">Name</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Email</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; font-weight: 600; vertical-align: top;">Message</td>
        <td style="padding: 12px 16px;">${message.replace(/\n/g, '<br/>')}</td>
      </tr>
    </table>
    <p>You can reply directly to <a href="mailto:${email}">${email}</a> to respond to this user.</p>
  `;
  return generateEmailLayout(content);
};

exports.newsletterSignupTemplate = () => {
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">You're on the list! 📬</h2>
    <p>Thanks for subscribing to Connect Sphere broadcasts. You'll now receive occasional updates about new features, campus events, and trending marketplace items directly in your inbox.</p>
    <p>Stay tuned for our next update.</p>
  `;
  return generateEmailLayout(content);
};
