var express = require('express');
const { use } = require('../users');
var router = express.Router();
var usersSchema = require('../../models/users.model');

router.put('/:id', async function(req, res, next) {
    try{
        console.log(req.role);
        if(req.role !== 'admin'){
            return res.status(403).send({
                status: 403,
                message: "Permission denied"
            });
        } else {

            let user = await usersSchema.findByIdAndUpdate(req.params.id, {isApproved: true});

            if(!user){
                return res.status(404).send({
                    status: 404,
                    message: "User not found"
                });
            } else {
                res.send({
                    status: 200,
                    message: "User approved",
                    data: null
                });
            }
            
        }

    }
    catch(error){
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

module.exports = router;