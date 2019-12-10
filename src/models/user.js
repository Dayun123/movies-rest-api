const mongoose = require('mongoose');
const validator = require('validator');

module.exports = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    validate: (email) => validator.isEmail(email),
  },
  apiKey: {
    type: String,
    required: true,
  },
}));