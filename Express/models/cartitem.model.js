const mongoose = require('mongoose');

const cartitemSchema = new mongoose.Schema({

    OrderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    Qty: { type: Number },
    p_price: { type: Number },
    p_name: { type: String},
    p_total: { type: Number },
    p_image: { type: String}
});

module.exports = mongoose.model('cartitems', cartitemSchema);