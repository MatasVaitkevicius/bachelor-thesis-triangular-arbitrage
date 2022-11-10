const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let tokenSchema = new Schema({
  symbol: {
    type: String
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  decimals: {
    type: Number
  },
  image: {
    type: String
  },
}, {
  collection: 'tokens'
})
module.exports = mongoose.model('Token', tokenSchema)