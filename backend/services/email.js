const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"राजभाषा अनुवादक" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

exports.sendVerificationEmail = async (user) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
  
  return this.sendEmail({
    to: user.email,
    subject: 'Verify Your Email - राजभाषा अनुवादक',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #1e40af;">Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationUrl}" 
           style="background: #1e40af; color: white; padding: 10px 15px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Now
        </a>
        <p><small>Token expires in 24 hours</small></p>
      </div>
    `
  });
};