const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../services/email');
const { ROLES } = require('../config/constants');

// Secure token generation
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Token verification wrapper
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

exports.register = async (req, res) => {
  try {
    const { officialId, email, department, password } = req.body;

    // Validate input
    if (!/^[A-Z]{2}\d{6}$/.test(officialId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid official ID format (e.g. MH123456)'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ officialId }, { email }] });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'User already exists'
      });
    }

    // Create user
    const user = new User({
      officialId,
      email,
      department,
      password,
      role: ROLES.USER,
      verificationToken: generateToken(),
      verificationExpires: Date.now() + 86400000 // 24 hours
    });

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - राजभाषा अनुवादक',
      html: `Email verification link: <a href="${verificationUrl}">Verify</a>`
    });

    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Please verify your email.'
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOneAndUpdate(
      { 
        verificationToken: token,
        verificationExpires: { $gt: Date.now() }
      },
      { 
        isVerified: true,
        $unset: { 
          verificationToken: 1,
          verificationExpires: 1 
        }
      }
    );

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired token'
      });
    }

    res.json({ 
      success: true,
      message: 'Email verified successfully'
    });

  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { officialId, password } = req.body;
    const user = await User.findOne({ officialId }).select('+password +loginAttempts');

    // Validate user
    if (!user || !(await user.comparePassword(password))) {
      user.loginAttempts += 1;
      await user.save();
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Reset attempts
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      }
    );

    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        officialId: user.officialId,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
};