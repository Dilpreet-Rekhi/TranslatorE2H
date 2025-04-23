const Contact = require('../models/Contact');
const { sendEmail } = require('../services/email');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, department, message } = req.body;

    // Save to database
    const contact = new Contact({
      name,
      email,
      department,
      message,
      ipAddress: req.ip
    });
    await contact.save();

    // Send email notification
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    res.json({ 
      success: true,
      message: 'Your query has been submitted successfully'
    });

  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while processing your request' 
    });
  }
};