var express = require("express");
var router = express.Router();
var lab_schema = require("../models/labs.model");

router.get("/", async function (req, res, next) {
  try {
    let labs = await lab_schema.find({});

    console.log(labs);

    if (labs.length === 0) {
      return res.status(404).send({
        status: 404,
        message: "Labs Not found.",
      });
    }

    res.send({
      status: 200,
      message: "success",
      data: labs,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

//create lab
router.post("/", async function (req, res, next) {
  try {
    let { lab_code, lab_name, zone, province } = req.body;

    const newLab = new lab_schema({
      lab_code,
      lab_name,
      zone,
      province,
    });

    await newLab.save();

    res.status(201).send({
      status: 201,
      message: "Create Success.",
      data: newLab,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// GET labs with query parameters
router.get("/test", async (req, res) => {
  try {
    const { province, lab_code, date, page = 1, limit = 10 } = req.query;
    let query = {};

    if (province) query.province = { $regex: new RegExp(province, "i") };
    if (lab_code) query.lab_code = { $regex: new RegExp(lab_code, "i") };

    if (date) {
      const start_date = new Date(date);
      start_date.setHours(0, 0, 0, 0); // Set start of day
      const end_date = new Date(date);
      end_date.setHours(23, 59, 59, 999); // Set end of day
      query.create_at = { $gte: start_date, $lte: end_date };
    }

    const labs = await lab_schema
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    if (labs.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "Labs Not found.",
        });
    }

    const total_count = await lab_schema.countDocuments(query);

    // Format the create_at field
    const formatted_labs = labs.map((lab) => ({
      ...lab.toObject(),
      create_at: lab.create_at.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    res.status(200).json({
      status: 200,
      message: "Success to fetch labs data",
      current_page: parseInt(page),
      pages: Math.ceil(total_count / limit),
      current_count: labs.length,
      total_count: total_count,
      lab_count: labs.length,
      data: formatted_labs,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

module.exports = router;
