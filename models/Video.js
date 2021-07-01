const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  filename: {
    required: true,
    type: String
  },
  fileId: {
    required: true,
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Video", videoSchema);
