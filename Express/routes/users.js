var express = require('express');
var router = express.Router();
var usersSchema = require('../models/users.model');
var bcrypt = require('bcrypt');
const Users = require('../models/users.model');


router.get('/', async function(req, res, next) {
  try {
    let users = await usersSchema.find({})
    res.send({
      status: 200,
      message: "success",
      data: users
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});

// router.get('/', async function (req, res, next) {
//   try {

//     let users = await usersSchema.find({})

//     let hashPassword = await bcrypt.hash("1234", 10);

//     let result = await bcrypt.compare("1234",hashPassword)


//     let token = await jwt.sign({ foo: 'bar' }, '1234', { algorithm: 'HS256' })

//     let decode = await jwt.verify(token, '1234', { algorithms: 'HS256'})

//     res.send({
//       status: 200,
//       message: "success",
//       data: decode
//     });
//   } catch (error) {
//     res.status(500).send(error.toString())}
//   });



//get user by id
router.get('/:id', async function(req, res, next) {
  try {
    let user = await usersSchema.findById(req.params.id)
    res.send({
      status: 200,
      message: "success",
      data: user
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});



//create user
router.post('/', async function (req, res, next) {
  try {
    let { username, password, name, role, isApproved } = req.body;
    

    const newUser = new Users({
      username,
      password,
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
    res.status(500).send(error.toString())
  }
});

// router.post('/', async function (req, res, next) {
//   try {
//     let { username, password, name, role, isApproved } = req.body;
//     let hashPassword = await bcrypt.hash(password, 10);


//     const user = new usersSchema({
//       username : username,
//       password : password,
//       name : name,
//       role : role,
//       isApproved : isApproved
//     })

//     await user.save()

//     res.status(201).send({
//       status: 201,
//       message: "Create Success.",
//       data: null
//     });
    
//   } catch (error) {
//     res.status(500).send(error.toString())
//   }
// });

router.put('/update/:id', async function (req, res, next) {
  try {
    let { name, age } = req.body

    let user = await usersSchema.findById(req.params.id)
    user.name = name
    user.age = age

    await user.save()

    res.send({
      status: 200,
      message: "Update Success.",
      data: null
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});


router.put('/update/:id', async function (req, res, next) {
  try {
    let { name, age } = req.body

    let user = await usersSchema.findById(req.params.id)
    user.name = name
    user.age = age

    await user.save()

    res.send({
      status: 200,
      message: "Update Success.",
      data: null
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});


//form trainer
router.put('/:id', async function (req, res, next) {
  try {

    let { name, age } = req.body
  
    let user = await usersSchema.findByIdAndUpdate(req.params.id, { name, age })

    res.status(200).send({
      status: 200,
      message: "Update Success.",
      data: user
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});


router.delete('/delete/:id', async function (req, res, next) {

  try {
    await usersSchema.findByIdAndDelete(req.params.id)
    res.send({
      status: 200,
      message: "Delete Success.",
      data: null
    });
  } catch (error) {
    res.status(500).send(error.toString())
  }
});





module.exports = router;
