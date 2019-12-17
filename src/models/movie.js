const mongoose = require('mongoose');

module.exports = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
}));