const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'admin'],
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  limitAttempts: true,
  maxAttempts: 10,
  unlockInterval: 7200000,
});

uniqueValidator.defaults.message = `{PATH} is already registered, Please login!`;
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
