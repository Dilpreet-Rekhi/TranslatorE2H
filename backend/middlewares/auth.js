const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.cookies.token || 
                 req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    // Check user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error('Authentication error:', err);
    
    let error = 'Authentication failed';
    if (err.name === 'TokenExpiredError') error = 'Session expired';
    if (err.name === 'JsonWebTokenError') error = 'Invalid token';

    res.status(401).json({ 
      success: false,
      error 
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized access' 
      });
    }
    next();
  };
};