var express = require('express');
var router = express.Router();
var productsSchema = require('../models/product.model');
var ordersSchema = require('../models/order.model');

//GET users listing
router.get('/', async function(req, res, next) {
    try {
      let products = await productsSchema.find({})
      res.send({
        status: 200,
        message: "success",
        data: products
      });
    } catch (error) {
      res.status(404).send({
        status: 404,
        message: "Client Error"
      })
    }
  });

//get product by id
router.get("/:id", async function(req, res, next){
    try{
        let product = await productsSchema.findById(req.params.id);
        res.send({
            status: 200,
            message: "success",
            data: product
        });
    } catch (error){
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

  //create product
router.post("/", async function(req, res, next){
    try {
        let { p_name, p_price, p_stock} = req.body;

        const newProduct = new productsSchema({
            p_name,
            p_price,
            p_stock
        });

        const product = await newProduct.save();

        res.status(201).send({
            status: 201,
            message: "Create Success.",
            data: {_id: product._id, p_name, p_price, p_stock}
        });
    }
    catch(error){
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

//update product
router.put("/:id", async function(req, res, next){
    try{
        let { p_name, p_price, p_stock } = req.body;

        let product = await productsSchema.findById(req.params.id);
        product.p_name = p_name;
        product.p_price = p_price;
        product.p_stock = p_stock;

        await product.save();

        res.status(201).send({
            status: 201,
            message: "Update Product Success.",
            data: {_id: product._id, p_name, p_price, p_stock}
        });
    
    } catch (error) {
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

router.delete("/:id", async function(req, res, next){
    try{
        await productsSchema.findByIdAndDelete(req.params.id);
        res.status(200).send({
            status: 200,
            message: "Delete Product Success.",
            data: null
        });
    } catch (error) {
        res.status(404).send({
            status: 404,
            message: "Client Error"
          })
    }
});

//Show orders for a product
router.get("/:id/orders", async function(req, res, next){
    try {
        // Find the product by ID
        let product = await productsSchema.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            });
        }


        // Check if there are any orders for the product
        let orders = await ordersSchema.find({ product_id: req.params.id });

        if (orders.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No orders found for the product"
            });
        }

        res.status(200).send({
            status: 200,
            message: "success",
            data: {
                product: product,
                orders: orders
            }
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post("/:id/orders", async function(req, res, next){
    try {
        const qty = req.body.qty;
        const user_id = req.uid;
        const product_id = req.params.id;

        console.log(user_id);

        if(qty < 1){
            return res.status(400).json({
                status: 400,
                message: "Quantity must be greater than 0"
            });
        }
        
        if (!user_id || !qty) {
            return res.status(400).json({
                status: 400,
                message: "user_id and qty are required fields"
            });
        }

        
        const product = await productsSchema.findById(product_id);

        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            });
        }

        
        if (product.p_stock < qty) {
            return res.status(400).json({
                status: 400,
                message: "Not enough stock available"
            });
        }

        
        const total_price = product.p_price * qty;

        
        const newOrder = new ordersSchema({
            user_id: user_id,
            product_id: product_id,
            product_name: product.p_name,
            qty: qty,
            total_price: total_price
        });

        
        await newOrder.save();

       
        product.p_stock -= qty;
        await product.save();

        res.status(201).json({
            status: 201,
            message: "Order added successfully",
            data: newOrder
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


module.exports = router;