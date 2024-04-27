const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    zone: { type: String, required: true } // You can add additional fields as needed
});

module.exports = mongoose.model('zone', zoneSchema);