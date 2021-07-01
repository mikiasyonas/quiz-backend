const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: [true, "Please add a username"] },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6
  },
  role: { type: String, enum: ["admin", "employee"] },
  department: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model("User", userSchema);
