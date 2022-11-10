const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
  name: {
    type: String
  },
  nonce: {
    type: String,
    required: true,
    default: function () {
      return Math.floor(Math.random() * 1000000);
    }
  },
  publicAddress: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
}, {
  collection: 'users'
})
module.exports = mongoose.model('User', userSchema)