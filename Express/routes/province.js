var express = require("express");
var router = express.Router();
var province_schema = require("../models/province.model");

router.get("/", async function (req, res, next) {
  try {
    let provinces = await province_schema.find({});

    console.log(provinces);

    if (provinces.length === 0) {
      return res.status(404).send({
        status: 404,
        message: "Provinces Not found.",
      });
    }

    res.send({
      status: 200,
      message: "success",
      data: provinces,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

//api for post province
// router.post("/", async function (req, res, next) {
//   try {
//     let { province_name } = req.body;

//     const newProvince = new province_schema({
//       province_name: province_name,
//     });


//     await newProvince.save();

//     res.status(201).send({
//       status: 201,
//       message: "Create Success.",
//       data: newProvince,
//     });
//   } catch (error) {
//     res.status(500).send(error.toString());
//   }
// });


//Post province by array of province
router.post("/", async function (req, res, next) {
  try {
    const provinceNames = req.body.provinces;

    // Validate if provinces array exists
    if (!Array.isArray(provinceNames)) {
      return res.status(400).send({
        status: 400,
        message: "Provinces array is required."
      });
    }

    // Array to store created provinces
    const createdProvinces = [];

    // Iterate over each province name and create a new document
    for (const province_name of provinceNames) {
      const newProvince = new province_schema({
        province_name: province_name,
      });

      // Save the new province to the database
      await newProvince.save();
      createdProvinces.push(newProvince);
    }

    res.status(201).send({
      status: 201,
      message: "Create Success.",
      data: createdProvinces,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;