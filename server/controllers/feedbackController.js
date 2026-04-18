const Feedback = require('../models/Feedback');
const Registration = require('../models/Registration');

// @desc    Submit feedback for an event
// @route   POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const studentId = req.user._id;

    // Check if student was registered for the event
    const registration = await Registration.findOne({ student: studentId, event: eventId });
    if (!registration) {
      return res.status(400).json({ message: 'You must be registered for this event to provide feedback' });
    }

    // Check if feedback already exists
    const existing = await Feedback.findOne({ student: studentId, event: eventId });
    if (existing) {
      // Update existing feedback
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    }

    const feedback = await Feedback.create({
      student: studentId,
      event: eventId,
      rating,
      comment
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get feedback for an event
// @route   GET /api/feedback/event/:eventId
exports.getEventFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('student', 'name collegeId')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    res.json({ feedback, avgRating, totalReviews: feedback.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
