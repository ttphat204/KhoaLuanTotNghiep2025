const express = require('express');
const router = express.Router();

// Import admin APIs
const employerManagement = require('../api/admin/employer-management');

// Admin routes
router.use('/employer-management', employerManagement);

module.exports = router; 