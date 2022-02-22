const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

const foodMenu = new Schema({
    name: { type: String},
    price: { type: Number},
    image: {type: String},
    classify: {type: Number},
    description: {type: String},
    slug: { type: String, slug: 'name', unique: true },
  },{
    timestamps: true,
  });

mongoose.plugin(slug);


module.exports = mongoose.model('foodMenu', foodMenu);