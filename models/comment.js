const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.virtual("comment_date_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Comment", commentSchema);
