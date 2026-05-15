const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

// All staff routes require authentication and super-admin role
router.get('/admin/staff', protect, authorize('super-admin'), getStaff);
router.post('/admin/staff', protect, authorize('super-admin'), createStaff);
router.put('/admin/staff/:id', protect, authorize('super-admin'), updateStaff);
router.delete('/admin/staff/:id', protect, authorize('super-admin'), deleteStaff);

module.exports = router;