var express = require('express');
var router = express.Router();
var ordersSchema = require('../models/order.model');

//test comment

router.get('/', async function(req, res, next) {
    try {
        let orders = await ordersSchema.find({})
        if(orders.length === 0){
            res.status(404).send({
                status: 404,
                message: "No orders found"
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "success",
                data: orders
                });
        }
    } catch (error) {
        res.status(404).send({
            status: 404,
            message: "Client Error"
        })
    }
});


router.get("/:id", async function(req, res, next){
    try{
        let order = await ordersSchema.findById(req.params.id);
        if(!order){
            res.status(404).send({
                status: 404,
                message: "Order not found"
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "success",
                data: order
            });
        }
    } catch (error){
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

router.get("/test", async function(req, res, next){
    console.log("test");
});


module.exports = router;