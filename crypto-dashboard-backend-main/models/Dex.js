const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let dexSchema = new Schema({
  symbol: {
    type: String
  },
  name: {
    type: String
  },
  factoryAddress: {
    type: String
  },
  routerAddress: {
    type: String
  },
  fee: {
    type: String
  },
  image: {
    type: String
  },
}, {
  collection: 'dexs'
})
module.exports = mongoose.model('Dex', dexSchema)