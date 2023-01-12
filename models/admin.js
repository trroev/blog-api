const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// hash plain text password before save
AdminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    admin.password = hashedPassword;
  }
  next();
});

// compare hashed password
AdminSchema.methods.isValidPassword = function (password) {
  const admin = this;
  return bcrypt.compareSync(password, admin.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
