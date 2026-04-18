const express = require('express');
const router = express.Router();
const { getCoordinators, createCoordinator, updateCoordinator, deleteCoordinator } = require('../controllers/coordinatorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getCoordinators);
router.post('/', protect, authorize('admin'), createCoordinator);
router.put('/:id', protect, authorize('coordinator', 'admin'), updateCoordinator);
router.delete('/:id', protect, authorize('admin'), deleteCoordinator);

module.exports = router;
