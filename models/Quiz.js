const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  name: String,
  description: String,
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  status: { type: Boolean, default: false },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
