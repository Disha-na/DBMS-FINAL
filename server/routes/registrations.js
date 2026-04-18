const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getEventParticipants,
  checkIn,
  getQRCode
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), registerForEvent);
router.delete('/:eventId', protect, authorize('student'), unregisterFromEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('coordinator', 'admin'), getEventParticipants);
router.post('/checkin', protect, authorize('coordinator', 'admin'), checkIn);
router.get('/qr/:regId', protect, getQRCode);

module.exports = router;
