const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { format, endOfMonth, differenceInDays } = require('date-fns');

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
  .schema.virtual('monthId')
  .get(function () {
    return format(this.endDate, 'MMMyyyy');
  });

paymentSchema.virtual('dues').get(function () {
  if (endOfMonth(new Date()) > this.duesFrom) {
    return differenceInDays(new Date(), this.duesFrom);
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
