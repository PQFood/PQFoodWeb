const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookShip = new Schema({
    name: { type: String},
    phoneNumber: { type: String},
    order: { type: String},
    state: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('bookShip', bookShip);