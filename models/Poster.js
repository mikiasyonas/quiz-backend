const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema({
  title: String,
  type: String,
  filename: {
    required: true,
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Poster", posterSchema);
