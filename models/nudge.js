const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: false
  },
  alsman: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  returnDate: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('Nudge', eventSchema);
