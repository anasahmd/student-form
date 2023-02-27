const Student = require('../models/student');

module.exports.renderStudentDashboard = async (req, res) => {
  const { category } = req.query;
  let students;
  if (category == 'pending') {
    students = await Student.find({ status: 0 });
  } else if (category == 'accepted') {
    students = await Student.find({ status: 1 });
  } else if (category == 'rejected') {
    students = await Student.find({ status: -1 });
  } else if (category == 'passed') {
    students = await Student.find({ status: 2 });
  } else {
    students = await Student.find({});
  }
  res.render('admin/index', { students });
};
