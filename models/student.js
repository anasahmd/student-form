const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  dp: {
    type: String,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
    enum: [-1, 0, 1, 2],
  },
});

studentSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Student', studentSchema);
