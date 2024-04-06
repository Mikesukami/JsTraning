var express = require('express');
var router = express.Router();
var usersSchema = require('../../models/users.model');
const Users = require('../../models/users.model');
var bcrypt = require('bcrypt');


//create user
router.post('/', async function (req, res, next) {
    try {
      let { username, password, name, role, isApproved } = req.body;
       // Hash the password
       const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new Users({
        username,
        password : hashedPassword,
        name,
        role,
        isApproved
      })
  
      const user = await newUser.save();
  
      res.status(201).send({
        status: 201,
        message: "Create Success.",
        data: {_id: user._id, username, name, role, isApproved}
      });
      
    } catch (error) {
      res.status(404).send({
        status: 404,
        message: error.message
      })
    }
  });


module.exports = router;