const express = require('express');
const router = express.Router();
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validate');

router.post('/', protect, authorize('student'), validateFeedback, submitFeedback);
router.get('/event/:eventId', getEventFeedback);

module.exports = router;
