const Coordinator = require('../models/Coordinator');
const { generateToken } = require('../middleware/auth');

// @desc    Get all coordinators
// @route   GET /api/coordinators
exports.getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find().sort({ createdAt: -1 });
    res.json(coordinators);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create coordinator
// @route   POST /api/coordinators
exports.createCoordinator = async (req, res) => {
  try {
    const { name, email, password, phone, department, role } = req.body;

    const existing = await Coordinator.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Coordinator with this email already exists' });
    }

    const coordinator = await Coordinator.create({ name, email, password, phone, department, role });

    res.status(201).json({
      _id: coordinator._id,
      name: coordinator.name,
      email: coordinator.email,
      role: coordinator.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update coordinator
// @route   PUT /api/coordinators/:id
exports.updateCoordinator = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const coordinator = await Coordinator.findByIdAndUpdate(
      req.params.id,
      { name, phone, department },
      { new: true, runValidators: true }
    );
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }
    res.json(coordinator);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete coordinator
// @route   DELETE /api/coordinators/:id
exports.deleteCoordinator = async (req, res) => {
  try {
    const coordinator = await Coordinator.findByIdAndDelete(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }
    res.json({ message: 'Coordinator removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
