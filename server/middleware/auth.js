const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Coordinator = require('../models/Coordinator');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'student') {
      req.user = await Student.findById(decoded.id);
    } else {
      req.user = await Coordinator.findById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Authorize by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not authorized to access this resource` });
    }
    next();
  };
};

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

module.exports = { protect, authorize, generateToken };
