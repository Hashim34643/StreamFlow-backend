const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
require("./models/db");
const createUserRouter = require("./routes/create-user");

const app = express();
app.use(cors());
app.use(express.json());

app.use(createUserRouter);

const server = app.listen(6952, () => {
  console.log("Port is listening");
});
server.timeout = 60000;

module.exports = server;