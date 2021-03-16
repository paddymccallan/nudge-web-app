const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  transactionRequestDate: {
    type: Date,
    required: true
  },
  transactionAcceptedDate: {
    type: Date,
    required: false
  },
  transactionAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Transaction', eventSchema);
