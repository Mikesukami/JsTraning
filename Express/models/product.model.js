const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    p_name:{type:String, unique:true},
    p_price:{type:Number},
    p_stock:{type:Number},
    p_image:{type:String}
  });

  module.exports = mongoose.model('products', productsSchema);