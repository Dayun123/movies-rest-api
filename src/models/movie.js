const mongoose = require('mongoose');

module.exports = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
  },
  overview: {
    type: String,
  },
  popularity: {
    type: Number,
  },
}));