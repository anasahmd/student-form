const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
  email: String,
});

adminSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

module.exports = mongoose.model('Admin', adminSchema);
