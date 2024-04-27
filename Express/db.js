// getting-started.js
const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect(`${process.env.MONGODB_URI}`);
  await mongoose.connect(`mongodb://127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  // await mongoose.connect(process.env.MONGODB_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
  // });
    console.log("Connected to MongoDB Successfully");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}