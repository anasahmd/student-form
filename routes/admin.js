const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const admin = require('../controllers/admin');

router.get('/student', isAdmin, catchAsync(admin.renderStudentDashboard));

module.exports = router;
