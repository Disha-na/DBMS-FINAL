const Registration = require('../models/Registration');
const Event = require('../models/Event');
const QRCode = require('qrcode');

// @desc    Register for an event
// @route   POST /api/registrations
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    const regCount = await Registration.countDocuments({ event: eventId });
    if (regCount >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Create registration
    const registration = await Registration.create({
      student: studentId,
      event: eventId
    });

    // Generate QR code
    const qrData = JSON.stringify({ regId: registration._id, studentId, eventId });
    const qrCode = await QRCode.toDataURL(qrData);
    registration.qrCode = qrCode;
    await registration.save();

    const populated = await Registration.findById(registration._id)
      .populate('event', 'title date venue category')
      .populate('student', 'name email collegeId');

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unregister from event
// @route   DELETE /api/registrations/:eventId
exports.unregisterFromEvent = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      student: req.user._id,
      event: req.params.eventId
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current student's registrations
// @route   GET /api/registrations/my
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'coordinator', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get participants for an event
// @route   GET /api/registrations/event/:eventId
exports.getEventParticipants = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email collegeId department year phone')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    QR check-in
// @route   POST /api/registrations/checkin
exports.checkIn = async (req, res) => {
  try {
    const { regId } = req.body;

    const registration = await Registration.findById(regId)
      .populate('student', 'name email collegeId')
      .populate('event', 'title');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.checkedIn) {
      return res.status(400).json({ message: 'Already checked in', registration });
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    res.json({ message: 'Check-in successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get QR code for a registration
// @route   GET /api/registrations/qr/:regId
exports.getQRCode = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.regId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (!registration.qrCode) {
      const qrData = JSON.stringify({
        regId: registration._id,
        studentId: registration.student,
        eventId: registration.event
      });
      registration.qrCode = await QRCode.toDataURL(qrData);
      await registration.save();
    }

    res.json({ qrCode: registration.qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
