const express = require('express');
const router = express.Router();
const { getStudents, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('coordinator', 'admin'), getStudents);
router.get('/:id', protect, getStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
