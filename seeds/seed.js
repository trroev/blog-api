require("dotenv").config();

const mongoose = require("mongoose");

// import Admin schema
const Admin = require("../models/admin");

// connect to mongodb
mongoose.connect(process.env.MONGODB_URL);

// create admin
const admin = new Admin({
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
});

admin.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("admin created successfully");
  }
  mongoose.connection.close();
});
