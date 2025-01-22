const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    province_name: {type:String},
});

module.exports = mongoose.model('Province', provinceSchema);
