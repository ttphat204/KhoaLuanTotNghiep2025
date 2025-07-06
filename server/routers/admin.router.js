const express = require('express');
const router = express.Router();

// Import admin APIs
const employerManagement = require('../api/admin/employer-management');
const categoryManagement = require('../api/admin/category-management');

// Admin routes
router.use('/employer-management', employerManagement);
router.use('/category-management', categoryManagement);

module.exports = router; 