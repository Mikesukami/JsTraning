const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    lab_code:{type:String, unique:true},
    lab_name:{type:String, unique:true},
    zone:{type:String},
    province:{type:String},
    create_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('lab', labSchema);


// const mongoose = require('mongoose');

// const labSchema = new mongoose.Schema({
//     lab_code: { type: String, unique: true },
//     lab_name: { type: String },
//     zone: { type: String, validate: { validator: validateZone, message: 'Invalid zone' } },
//     province: { type: String, validate: { validator: validateProvince, message: 'Invalid province' } },
//     created_at: { type: Date, default: Date.now }
// });


// async function validateZone(value) {
//     const Zone = mongoose.model('zone');
//     const count = await Zone.countDocuments({ zone: value });
//     return count > 0;
// }

// async function validateProvince(value) {
//     const Province = mongoose.model('province');
//     const count = await Province.countDocuments({ province: value });
//     return count > 0;
// }

// module.exports = mongoose.model('lab', labSchema);



