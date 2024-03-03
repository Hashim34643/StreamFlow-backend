const mongoose = require("mongoose");
require("dotenv").config();

const ENV = process.env.NODE_ENV || 'test';
const mongoURI = process.env.NODE_ENV === "test" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

const config = {};
if (ENV === 'production') {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
  }
  mongoose.connect(mongoURI)
  .then(() => {
      console.log("db connected");
  })
  .catch((error) => {
      console.error(error.message);
  });

module.exports = mongoURI;