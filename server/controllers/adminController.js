const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalStudents, totalEvents, totalRegistrations, totalFeedback] = await Promise.all([
      Student.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Feedback.countDocuments()
    ]);

    const checkedInCount = await Registration.countDocuments({ checkedIn: true });
    const attendanceRate = totalRegistrations > 0
      ? ((checkedInCount / totalRegistrations) * 100).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      totalEvents,
      totalRegistrations,
      totalFeedback,
      checkedInCount,
      attendanceRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get detailed analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Events by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Events by status
    const eventsByStatus = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Registrations over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationsOverTime = await Registration.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top events by registrations
    const topEvents = await Registration.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $project: {
          title: '$event.title',
          category: '$event.category',
          count: 1
        }
      }
    ]);

    // Average feedback rating per event
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$event',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1 } },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $project: {
          title: '$event.title',
          avgRating: { $round: ['$avgRating', 1] },
          count: 1
        }
      }
    ]);

    res.json({
      eventsByCategory,
      eventsByStatus,
      registrationsOverTime,
      topEvents,
      feedbackStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
