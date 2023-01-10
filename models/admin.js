const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const adminSchema = new mongoose.Schema({
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
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hashSync(
      admin.password,
      salt
    );
    admin.password = hashedPassword;
  }
  next();
});

// compare hashed password
adminSchema.methods.isValidPassword = async function (password) {
  const admin = this;
  const compare = await bcrypt.compare(password, admin.password);
  return compare;
};

module.exports = mongoose.model("Admin", adminSchema);
