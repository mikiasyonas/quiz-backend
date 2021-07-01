const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attemptIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attempt" }],
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);
