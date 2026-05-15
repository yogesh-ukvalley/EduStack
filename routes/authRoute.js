const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/admin/login - Admin login
router.post('/admin/login', login);

module.exports = router;