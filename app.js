require("dotenv").config();
require("./config/db")();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("./config/passport");

// import routes
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();
passport.use(JwtStrategy);

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Blog API app listening on port ${process.env.PORT}!`);
});
