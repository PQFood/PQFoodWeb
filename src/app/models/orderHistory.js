const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderHistory = new Schema({
    dinnerTable: {type: String},
    orderId: {type: String, unique: true},
    note: { type: String},
    order: {type: Array},
    total: {type: Number},
    state: {type: String}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('orderHistory', orderHistory);