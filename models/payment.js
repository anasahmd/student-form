const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
  format,
  endOfMonth,
  differenceInDays,
  addMonths,
  addDays,
} = require('date-fns');

const paymentSchema = new Schema({
  monthlyData: [
    {
      endDate: Date,
      amount: Number,
      paid: Boolean,
    },
  ],
  duesFrom: Date,
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  email: String,
});

paymentSchema
  .path('monthlyData')
  .schema.virtual('lateFees')
  .get(function () {
    if (this.paid !== true && new Date() > this.endDate) {
      const monthDays = differenceInDays(
        endOfMonth(addDays(this.endDate, 1)),
        this.endDate
      );
      const currentDays = differenceInDays(new Date(), this.endDate);
      return (currentDays > monthDays ? monthDays : currentDays) * 10;
    }
  });

paymentSchema.virtual('currentDues').get(function () {
  const months = this.monthlyData.filter(
    (n) => n.endDate <= endOfMonth(new Date())
  );
  let dues = 0;
  months.forEach((month) => {
    if (month.paid != true) {
      dues = dues + month.amount;
      if (month.lateFees) {
        dues = dues + month.lateFees;
      }
    }
  });
  return dues;
});

paymentSchema.virtual('totalDues').get(function () {
  const months = this.monthlyData.filter((n) => n.paid !== true);
  let dues = 0;
  months.forEach((month) => {
    dues = dues + month.amount;
    if (month.lateFees) {
      dues = dues + month.lateFees;
    }
  });
  return dues;
});

// paymentSchema.virtual('dues').get(function () {
//   if (endOfMonth(new Date()) > this.duesFrom) {
//     return differenceInDays(new Date(), this.duesFrom);
//   }
// });

module.exports = mongoose.model('Payment', paymentSchema);
