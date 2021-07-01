const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  attempt: { type: Boolean },
  createdAt: {
    type: Date,
    default: Date.now
  } 
});

module.exports = mongoose.model("Attempt", attemptSchema);
