const mongoose = require('mongoose');
const wordSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const dictionarySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  words: [wordSchema]
});
  
module.exports = mongoose.model('Dictionary', dictionarySchema);