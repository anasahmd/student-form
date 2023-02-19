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
    // return format(this.endDate, 'MMMyyyy');
    if (this.paid !== true && new Date() > this.endDate) {
      return differenceInDays(
        endOfMonth(addDays(this.endDate, 1)),
        this.endDate
      ) < differenceInDays(new Date(), this.endDate)
        ? differenceInDays(endOfMonth(addDays(this.endDate, 1)), this.endDate) *
            10
        : differenceInDays(new Date(), this.endDate) * 10;
    }
  });

// paymentSchema.virtual('dues').get(function () {
//   if (endOfMonth(new Date()) > this.duesFrom) {
//     return differenceInDays(new Date(), this.duesFrom);
//   }
// });

module.exports = mongoose.model('Payment', paymentSchema);
