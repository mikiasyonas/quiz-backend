const asyncHandler = require("../middleware/async");

const Result = require("../models/Result");
// @desc    Create a Quiz
// @route   POST /api/quiz
// @access  ADMIN

exports.getAllResults = asyncHandler(async (req, res, next) => {
  const allResults = await Result.find().populate(
    "quizId employeeId attemptIds"
  );

  return res.status(200).json({
    success: 1,
    data: allResults
  });
});

exports.getScorebyEmployee = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const results = await Result.find({ employeeId: id }).populate(
    "quizId employeeId"
  );
  results.forEach((result, i) => {
    const scorePercentage = (
      (result.quizId.questionIds.length / result.score) *
      100
    ).toFixed(3);
    results[i].score = scorePercentage;
  });

  return res.status(200).json({
    success: 1,
    data: results
  });
});

exports.getEmployeeAttemptStats = asyncHandler(async (req, res, next) => {
  const attemptStats = await Result.find().populate("attemptIds employeeId");
  let results = [];
  const data = attemptStats.forEach((attempt) => {
    const user = attempt.employeeId;
 
    let pass = 0;
    let fail = 0;
    const attempts = attempt.attemptIds.forEach((attempt) => {
      if (attempt.attempt) pass = pass + 1;
      else fail = fail + 1;
    });

    let isUserAlreadyExists = results.findIndex(
      (x) => x.user._id === attempt.employeeId._id
    );

    if (isUserAlreadyExists >= 0) {
      console.log(results);
      console.log("IS USER ALREADY EXIST", isUserAlreadyExists);
      results[isUserAlreadyExists].pass =
        results[isUserAlreadyExists].pass + pass;
      results[isUserAlreadyExists].fail =
        results[isUserAlreadyExists].fail + fail;
      results[isUserAlreadyExists].total =
        results[isUserAlreadyExists].pass + results[isUserAlreadyExists].fail;
    } else {
      results.push({ user, pass, fail, total: pass + fail });
    }
  });
  console.log(results);
  return res.status(200).json({
    success: 1,
    data: results
  });
});

exports.getQuizStats = asyncHandler(async (req, res, next) => {
  const attemptStats = await Result.find().populate(
    "attemptIds quizId employeeId"
  );
  let results = [];
  const data = attemptStats.forEach((attempt) => {
    const quiz = attempt.quizId;
    let pass = 0;
    let fail = 0;
    const attempts = attempt.attemptIds.forEach((attempt) => {
      if (attempt.attempt) pass = pass + 1;
      else fail = fail + 1;
    });

    let isQuizAlreadyExists = results.findIndex(
      (x) => x.quiz._id === attempt.quizId._id
    );

    if (isQuizAlreadyExists >= 0) {
      results[isQuizAlreadyExists].pass =
        results[isQuizAlreadyExists].pass + pass;
      results[isQuizAlreadyExists].fail =
        results[isQuizAlreadyExists].fail + fail;
      results[isQuizAlreadyExists].total =
        results[isQuizAlreadyExists].pass + results[isQuizAlreadyExists].fail;
    } else {
      results.push({ quiz, pass, fail, total: pass + fail });
    }
  });

  return res.status(200).json({
    success: 1,
    data: results
  });
});
