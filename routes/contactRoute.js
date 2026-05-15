const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, updateContactStatus, getFollowUps } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/contact - Submit contact form (public)
router.post('/contact', createContact);

// GET /api/admin/contacts - Get all contacts (authenticated users)
router.get('/admin/contacts', protect, getAllContacts);

// GET /api/admin/contacts/follow-ups - Get follow-up contacts (authenticated users)
router.get('/admin/contacts/follow-ups', protect, getFollowUps);

// PATCH /api/admin/contacts/:id/status - Update lead status (authenticated users)
router.patch('/admin/contacts/:id/status', protect, updateContactStatus);

module.exports = router;