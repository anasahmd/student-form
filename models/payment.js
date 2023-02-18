const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { format } = require('date-fns');

const paymentSchema = new Schema({
  monthlyData: [
    {
      startDate: Date,
      amount: Number,
      paid: Boolean,
    },
  ],
  paidTill: Date,
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  email: String,
});

// paymentSchema
//   .path('monthlyData')
//   .schema.virtual('monthId')
//   .get(function () {
//     return format(this.startDate, 'MMMyyyy');
//   });

module.exports = mongoose.model('Payment', paymentSchema);
