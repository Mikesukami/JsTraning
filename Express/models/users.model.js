const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    name: { type: String, unique: true},
    role:{type:String},
    isApproved: { type: Boolean, default: false }
  },{
    timestamps: true
  });


module.exports = mongoose.model('users', usersSchema);