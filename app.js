require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("./config/db")();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Blog API");
});

app.listen(process.env.PORT, () => {
  console.log(`Blog API app listening on port ${process.env.PORT}!`);
});
