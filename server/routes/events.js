const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validate');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('coordinator', 'admin'), validateEvent, createEvent);
router.put('/:id', protect, authorize('coordinator', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('coordinator', 'admin'), deleteEvent);

module.exports = router;
