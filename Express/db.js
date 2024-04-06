// getting-started.js
const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:${process.env.DB_PORT}/EX-JS`);
    console.log("Connected to MongoDB Successfully");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}