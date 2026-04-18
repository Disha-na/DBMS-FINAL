const Student = require('../models/Student');
const Coordinator = require('../models/Coordinator');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new student
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, collegeId, password, phone, department, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { collegeId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or college ID already exists' });
    }

    const student = await Student.create({ name, email, collegeId, password, phone, department, year });

    const token = generateToken(student._id, 'student');

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      collegeId: student.collegeId,
      role: 'student',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user (student or coordinator)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    let userRole;

    if (role === 'coordinator' || role === 'admin') {
      user = await Coordinator.findOne({ email }).select('+password');
      userRole = user ? user.role : 'coordinator';
    } else {
      user = await Student.findOne({ email }).select('+password');
      userRole = 'student';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, userRole);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: userRole,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
