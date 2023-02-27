const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Payment = require('../models/payment');
const Student = require('../models/student');
const User = require('../models/user');
const student = require('../controllers/student');
const { isLoggedIn, isAdmin } = require('../middleware');

router
  .route('/apply')
  .get(isLoggedIn, catchAsync(student.renderApply))
  .post(catchAsync(student.studentApply));

router
  .route('/payment')
  .get(catchAsync(student.showPayment))
  .post(catchAsync(student.processPayment));

router.post('/actions', isAdmin, catchAsync(student.actionsAdmin));

module.exports = router;
