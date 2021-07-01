const asyncHandler = require("../middleware/async");
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

// @desc    Create a Question
// @route   POST /api/question
// @access  ADMIN

exports.createQuestion = asyncHandler(async (req, res, next) => {
  const { questionType, description, options, title } = req.body;
  // Check if question already exists
  const isFound = await Question.findOne({ title });
  if (isFound) return next(new ErrorResponse("Question already exists", 409));
  const question = await Question.create({
    questionType,
    title,
    description,
    options
  });
  return res.status(201).json({
    success: 1,
    message: `Question with id ${question._id} created`,
    data: question
  });
});

// @desc    Get All Questions
// @oute    GET /api/v1/auth/register
// @access  ADMIN

exports.getAllQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find();
  return res.status(200).json({
    success: 1,
    data: questions
  });
});

exports.getAllQuestionsScore = asyncHandler(async (req, res, next) => {
  const questions = await Question.find().lean();
  for (const question of questions) {
    const attempts = await Attempt.find({ questionId: question._id }).select(
      "attempt"
    );
    let correct = 0;
    let wrong = 0;
    attempts.forEach((attempt) => {
      if (attempt.attempt === true) correct = correct + 1;
      else wrong = wrong + 1;
    });
    let failRate = 0;
    let passRate = 0;
    if (wrong !== 0) failRate = ((wrong/attempts.length) * 100).toFixed(1);
    if (correct !== 0)
      passRate = ((correct/attempts.length) * 100).toFixed(1);

    question.failRate = failRate;
    question.passRate = passRate;
    question.attempts = attempts;
  }

  return res.status(200).json({
    success: 1,
    data: questions
  });
});

// @desc    Get Question By Question ID
// @route   GET /api/question/:qid
// @access  ADMIN
exports.getQuestionById = asyncHandler(async (req, res, next) => {
  const id = req.params.qid;
  const question = await Question.findById(id);
  return res.status(200).json({
    success: 1,
    data: question
  });
});

// @desc    Update Question by Question ID
// @route   PUT /api/question/:qid
// @access  ADMIN
exports.updateQuestionById = asyncHandler(async (req, res, next) => {
  const id = req.params && req.params.id ? req.params.id : "";
  if (!id) return next(new ErrorResponse("ID Not provided, Bad Request", 400));
  const { questionType, description, options } = req.body;
  const question = await Question.findByIdAndUpdate(id, {
    questionType,
    description,
    options
  });
  return res.status(200).json({
    success: 1,
    data: question
  });
});

// @desc    Delete Question by Question ID
// @route   DELETE /api/question/:qid
// @access  ADMIN
exports.deleteQuestionById = asyncHandler(async (req, res, next) => {
  const id = req.params && req.params.id ? req.params.id : "";
  if (!id) return next(new ErrorResponse("ID Not provided, Bad Request", 400));
  await Question.findByIdAndDelete(id);
  return res.status(204).json({
    success: 1
  });
});
