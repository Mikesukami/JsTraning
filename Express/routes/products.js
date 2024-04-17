var express = require("express");
var router = express.Router();
var productsSchema = require("../models/product.model");
var ordersSchema = require("../models/order.model");
var cartitemsSchema = require("../models/cartitem.model")
var multer = require("multer");
var path = require("path");

const fs = require("fs");
const dir = path.resolve(__dirname, "../public/images");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//GET users listing
router.get("/", async function (req, res, next) {
  try {
    let products = await productsSchema.find({});
    res.send({
      status: 200,
      message: "success",
      data: products,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Client Error",
    });
  }
});

//get product by id
router.get("/:id", async function (req, res, next) {
  try {
    let product = await productsSchema.findById(req.params.id);
    res.send({
      status: 200,
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Client Error",
    });
  }
});

//create product
router.post("/", upload.single("p_image"), async function (req, res, next) {
  try {
    let { p_name, p_price, p_stock } = req.body;
    let p_image = req.file.filename;

    const newProduct = new productsSchema({
      p_name,
      p_price,
      p_stock,
      p_image,
    });

    const product = await newProduct.save();

    res.status(201).send({
      status: 201,
      message: "Create Success.",
      data: { _id: product._id, p_name, p_price, p_stock, p_image },
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Client Error",
    });
  }
});

//update product
router.put("/:id", upload.single("p_image"), async function (req, res, next) {
  try {
    let { p_name, p_price, p_stock } = req.body;
    let p_image = null;
    if (req.file) {
      p_image = req.file.filename;
    } else {
      p_image = null;
      console.log("No image uploaded");
    }

    let product = await productsSchema.findById(req.params.id);

    if (p_image === null) {
      p_image = product.p_image;
    }

    product.p_name = p_name;
    product.p_price = p_price;
    product.p_stock = p_stock;
    product.p_image = p_image;

    await product.save();

    res.status(201).send({
      status: 201,
      message: "Update Product Success.",
      data: {
        _id: product._id,
        p_name,
        p_price,
        p_stock,
        p_image: product.p_image,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Client Error",
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    await productsSchema.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "Delete Product Success.",
      data: null,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Client Error",
    });
  }
});

//Show orders for a product
router.get("/:id/orders", async function (req, res, next) {
  try {
    // Find the product by ID
    let product = await productsSchema.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    // Check if there are any orders for the product
    let orders = await ordersSchema.find({ product_id: req.params.id });

    if (orders.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No orders found for the product",
      });
    }

    res.status(200).send({
      status: 200,
      message: "success",
      data: {
        product: product,
        orders: orders,
      },
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/:id/orders", async function (req, res, next) {
  try {
    const qty = req.body.qty;
    const user_id = req.uid;
    const product_id = req.params.id;

    console.log(user_id);

    if (qty < 1) {
      return res.status(400).json({
        status: 400,
        message: "Quantity must be greater than 0",
      });
    }

    if (!user_id || !qty) {
      return res.status(400).json({
        status: 400,
        message: "user_id and qty are required fields",
      });
    }

    const product = await productsSchema.findById(product_id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    if (product.p_stock < qty) {
      return res.status(400).json({
        status: 400,
        message: "Not enough stock available",
      });
    }

    const total_price = product.p_price * qty;

    const newOrder = new ordersSchema({
      user_id: user_id,
      product_id: product_id,
      product_name: product.p_name,
      qty: qty,
      total_price: total_price,
    });

    await newOrder.save();

    product.p_stock -= qty;
    await product.save();

    res.status(201).json({
      status: 201,
      message: "Order added successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/addcart", async function (req, res, next) {
  const { product_id, qty } = req.body;
  console.log(product_id);
  console.log(qty);

  try {
    if (!product_id || !qty || qty <= 0) {
      return res.status(400).send({
        status: 400,
        message: "Invalid product ID or qty",
      });
    }

    const product = await productsSchema.findById(product_id);

    if (!product) {
      return res.status(404).send({
        status: 404,
        message: "Product not found",
      });
    }

    let p_stock = product.p_stock - qty;

    if (p_stock >= 0) {
      let updatedProduct = await productsSchema.findByIdAndUpdate(product_id, {
        p_stock: p_stock,
      });

      const cart = new cartitemsSchema({
        product_id: product_id,
        qty: qty,
        p_name: product.p_name,
        p_image: product.p_image,
        p_price: product.p_price,
        p_total: product.p_price * qty,
      });

      await cart.save();

      return res.status(200).send({
        status: 200,
        message: "Product added to cart successfully",
      });
    } else {
      return res.status(500).send({
        status: 500,
        message: "OUT OF STOCK",
        data: "Available Stock: " + product.p_stock,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// router.get("/carts", async function (req, res, next) {
//     console.log("get cart");
//     try {
//       const cart = await cartitemsSchema.find({ OrderId: null });
//       res.status(200).send({
//         status: 200,
//         message: "Success",
//         data: cart
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({
//         status: 500,
//         message: "Internal Server Error",
//       });
//     }
//   }); 

  router.get("/test", async function (req, res, next) {
    try {
      let products = await productsSchema.find({});
      res.send({
        status: 200,
        message: "success",
        data: products,
      });
    } catch (error) {
      res.status(404).send({
        status: 404,
        message: "Client Error",
      });
    }
  });

module.exports = router;
