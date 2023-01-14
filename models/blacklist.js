const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

BlacklistSchema.index({ token: 1 });

BlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = Blacklist;
