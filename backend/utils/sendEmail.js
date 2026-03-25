const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  // Always log email content to console in dev mode for testing
  console.log('\n========== EMAIL DEBUG ==========');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  // Extract any OTP or reset link from the HTML for easy copy-paste
  const otpMatch = options.message.match(/letter-spacing[^>]*>(\d{6})</);
  const linkMatch = options.message.match(/href="([^"]*reset-password[^"]*)"/);
  if (otpMatch) console.log(`OTP Code: ${otpMatch[1]}`);
  if (linkMatch) console.log(`Reset Link: ${linkMatch[1]}`);
  console.log('=================================\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Connect Sphere <onboarding@resend.dev>',
      to: options.email,
      subject: options.subject,
      html: options.message,
    });

    if (error) {
      console.error('Resend API Error:', error);
      // Don't throw in dev — the console log above is enough for testing
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Email delivery failed.');
      }
      console.warn('⚠️  Email delivery failed (Resend free tier only sends to account owner email). Use the console output above to test.');
      return;
    }
    
    console.log('✅ Email dispatched via Resend API.', data);
  } catch (err) {
    console.error('Fatal error dispatching email via Resend:', err);
    // In dev mode, don't throw — allow the flow to continue using console output
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    console.warn('⚠️  Email send failed but dev mode continues. Use console output above.');
  }
};

module.exports = sendEmail;
