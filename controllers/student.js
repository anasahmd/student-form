const Student = require('../models/student');
const User = require('../models/user');
const Payment = require('../models/payment');
const { endOfMonth, addMonths } = require('date-fns');

module.exports.renderApply = async (req, res) => {
  const user = await User.findById(req.user._id);
  const student = await Student.findOne({ email: user.email });
  if (student) {
    res.render('student/application', { student });
  } else {
    res.render('student/application', { user });
  }
};

module.exports.studentApply = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fatherName, dob, gender, address, contactNumber } = req.body.student;
  const { name, email } = user;
  const newStudent = new Student({
    name,
    fatherName,
    contactNumber,
    email,
    dob,
    gender,
    address,
    status: 0,
  });
  newStudent.user = req.user._id;
  user.student = newStudent._id;
  await newStudent.save();
  await user.save();
  res.redirect('/student/payment');
};

module.exports.showPayment = async (req, res) => {
  const paymentData = await Payment.findOne({ email: req.user.email });
  res.render('student/payment', { paymentData });
};

module.exports.processPayment = async (req, res) => {
  const { duration } = req.query;
  const paymentData = await Payment.findOne({ email: req.user.email });
  if (duration == 'totalDues') {
    const months = paymentData.monthlyData.filter((n) => n.paid !== true);
    months.forEach((month) => {
      month.paid = true;
    });
  } else if (duration == 'currentDues') {
    const months = paymentData.monthlyData.filter(
      (n) => n.endDate <= endOfMonth(new Date())
    );
    months.forEach((month) => {
      month.paid = true;
    });
  } else if (duration == 'multiMonths') {
    const months = paymentData.monthlyData.filter(
      (n) => endOfMonth(new Date(req.body.month)) >= new Date(n.endDate)
    );
    months.forEach((month) => {
      month.paid = true;
    });
  } else if (duration == 'month') {
    const { id } = req.query;
    const reqMonth = paymentData.monthlyData.findIndex(
      ({ _id }) => _id.toString() === id
    );
    if (reqMonth === 0) {
      paymentData.monthlyData[reqMonth].paid = true;
      paymentData.duesFrom = addMonths(
        paymentData.monthlyData[reqMonth].endDate,
        1
      );
    } else if (paymentData.monthlyData[reqMonth - 1].paid === true) {
      paymentData.monthlyData[reqMonth].paid = true;
      paymentData.duesFrom = addMonths(
        paymentData.monthlyData[reqMonth].endDate,
        1
      );
    } else {
      next(new ExpressError('Error', 404));
    }
  }
  await paymentData.save();
  res.redirect('back');
};

module.exports.actionsAdmin = async (req, res) => {
  const { action, id } = req.query;
  const student = await Student.findById(id);
  if (action == 'accept') {
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const endDate = endOfMonth(addMonths(new Date('2023-01-01'), i));
      const paid = false;
      const amount = 1000;
      monthlyData.push({ endDate, amount, paid });
    }

    const newPayment = new Payment({
      monthlyData,
      student: student._id,
      email: student.email,
    });
    student.status = 1;
    student.payment = newPayment._id;
    await newPayment.save();
  } else if (action == 'reject') {
    student.status = -1;
  } else if (action == 'passed') {
    student.status = 2;
  } else {
    next(new ExpressError('Error', 404));
  }
  await student.save();
  res.redirect('back');
};
