const mongoose = require("mongoose");
require("dotenv").config;

module.exports = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log(
      "Mongoose default connection is open to =>",
      process.env.MONGODB_URL
    );
  });

  mongoose.connection.on("error", (err) => {
    console.log(
      "Mongoose default connection has occured " + err + " error"
    );
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose default connection is disconnected");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "Mongoose default connection is disconnected due to application termination"
      );
      process.exit(0);
    });
  });
};
