const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chuquan = new Schema({
    username: { type: String, unique: true},
    password: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('chuquan', chuquan);