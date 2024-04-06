const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    product_name: { type: String },
    qty: { type: Number },
    total_price: { type: Number }
  },{
    timestamps: true
  });

module.exports = mongoose.model('orders', orderSchema);