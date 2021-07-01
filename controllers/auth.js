const asyncHandler = require("../middleware/async");

const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Register User (Roles: employee, admin)  
// @oute    POST /api/auth/register
// @access  Public

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { userName, password, role, department } = req.body; 
  // Check if user already exists
  const isFound = await User.findOne({ userName });
  if (isFound) return next(new ErrorResponse("User already exists", 409));
  // Create user
  const user = await User.create({ userName, password, role, department });
  return res.status(200).json({
    success: 1,
    message: `User with role ${user.role} successfully created`
  });
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  // Validate emil & password
  if (!userName || !password) {
    return next(
      new ErrorResponse("Please provide an userName and password", 400)
    );
  }

  // Check for user
  const user = await User.findOne({
    $and: [{ userName }, { password }]
  });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get Users

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    data: users
  });
});

// Get User by Id

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.find({ _id: req.params.id });
  res.status(200).json({
    success: true,
    data: user
  });
});

// Update User
exports.updateUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { userData } = req.body;
  const user = await User.findOneAndUpdate({ _id: id }, userData);
  res.status(200).json({
    success: true,
    data: user
  });
});

// Delete User
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { userData } = req.body;
  const user = await User.findOneAndDelete({ _id: id }, userData);
  res.status(200).json({
    success: true,
    data: user
  });
});

// Get Employee Stats
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await User.aggregate([
    { $match: {} },
    { $group: { _id: "$role", total: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token
  });
};
