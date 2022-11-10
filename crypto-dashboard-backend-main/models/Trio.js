const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let trioSchema = new Schema({
  symbol: {
    type: String
  },
  tokens: {
    type: Array
  },
  seed: {
    type: String
  },
  requiredProfit: {
    type: Number
  },
  minimumOutput: {
    type: String
  },
  approvalAmount: {
    type: String
  },
  images: {
    type: Array
  },
}, {
  collection: 'trios'
})
module.exports = mongoose.model('Trio', trioSchema)