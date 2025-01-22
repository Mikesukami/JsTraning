var express = require('express');
var router = express.Router();
var usersSchema = require('../../models/users.model');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async function (req, res, next) {
    try {
        let { username, password } = req.body;

        let user = await usersSchema.findOne({ username: username });

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "User not found"
            });
        }
        if (!password) {
            return res.status(400).send({
                status: 400,
                message: "Password is required"
            });
        }
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({
                status: 401,
                message: "Password does not match"
            });
        }
        if (user.isApproved === false) {
            return res.status(401).send({
                status: 401,
                message: "User not approved"
            });
        }
        let token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: "30m", algorithm: 'HS256' });

        res.send({
            status: 200,
            message: "success",
            token: token,
            role: user.role
        });

    } catch (error) {
        res.status(404).send({
            status: 404,
            message: "Client error"
        });
    }
});



module.exports = router;