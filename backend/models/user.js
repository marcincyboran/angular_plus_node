const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  emails: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = userSchema;
module.exports = User;