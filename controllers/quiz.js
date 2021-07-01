const asyncHandler = require("../middleware/async");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

const Quiz = require("../models/Quiz");
// @desc    Create a Quiz
// @route   POST /api/quiz
// @access  ADMIN

exports.createQuiz = asyncHandler(async (req, res, next) => {
  const { name, description, questionIds, status, slug } = req.body;

  // Check if quiz already exists
  const isFound = await Quiz.findOne({ name });
  if (isFound) return next(new ErrorResponse("Quiz already exists", 409));
  const quiz = await Quiz.create({
    name,
    description,
    questionIds,
    status,
    slug
  });
  return res.status(201).json({
    success: 1,
    message: `Quiz with id ${quiz._id} created`,
    data: quiz
  });
});

// @desc    Get All Quiz
// @route   GET /api/quiz
// @access  ADMIN

exports.getAllQuiz = asyncHandler(async (req, res, next) => {
  const allQuiz = await Quiz.find().populate("questionIds");

  // .aggregate({
  //   $project: { NumberOfItemsInArray: { $size: "$questionIds" } }
  // });
  return res.status(200).json({
    success: 1,
    data: allQuiz
  });
});

exports.getQuestions = asyncHandler(async(req, res, next) => {
  const { slug } = req.params;
  let questionsArray = [];
  const questions = await Quiz.find({
    slug: slug
  });

  questionsIdList = questions[0].questionIds;

  // questionsIdList.forEach(async (id) => {
  //   console.log(id);
  //   let question = await Question.findById(id);
  //   questionsArray1.push(question);
  // });
  for(let i = 0; i < questionsIdList.length; i++) {
    let question = await Question.findById(questionsIdList[i]);
    questionsArray.push(question);
  }

  // console.log(questionsArray);
  return res.json({
    data: questionsArray,
    message: "questions"
  });
  // res.send(link);
});

// @desc    Get Quiz By quiz ID
// @route   GET /api/quiz/:qid
// @access  ADMIN
exports.getQuizById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const quiz = await Quiz.findById(id).populate("questionIds");
  return res.status(200).json({
    success: 1,
    data: quiz
  });
});


// @desc    Update Quiz by Quiz ID (Assign/Unassign)
// @route   PUT /api/quiz/:qid
// @access  ADMIN
exports.updateQuizById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  console.log("ID", id);
  const quizObject =  await Quiz.findById(id).populate("questionIds");
  if (req.body.name) quizObject.name = req.body.name;
  if (req.body.description) quizObject.description = req.body.description;
  if (req.body.status) quizObject.status = req.body.status;
  if (req.body.type === "assign"){
    quizObject.$addToSet = { questionIds: req.body.questionIds };
    quizObject.questionIds = req.body.questionIds;
  }
  else if(req.body.questionIds){
    quizObject.$pullAll = { questionIds: req.body.questionIds };
    quizObject.questionIds = req.body.questionIds;
  }
  if (req.body.questionIds) console.log("QUIZ OBJECT", quizObject);
  await Quiz.findByIdAndUpdate(id, quizObject);
  let quiz = await Quiz.findById(id).populate("questionIds");
  return res.status(201).json({
    success: 1,
    data: quizObject
  });
});

// @desc    Delete Question by Question ID
// @route   DELETE /api/question/:qid
// @access  ADMIN
exports.deleteQuizById = asyncHandler(async (req, res, next) => {
  const id = req.params.qid;
  const del = await Quiz.findByIdAndDelete(id);
  return res.status(204).json({
    success: true
  });
});

// Set Quiz to Active/Non-Active
exports.setQuizStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  await Quiz.findOneAndUpdate({ _id: id }, { status });
  return res.status(200).json({
    success: 1
  });
});

// Active and Non-Active quizes
exports.getQuizStats = asyncHandler(async (req, res, next) => {
  const activeQuiz = await Quiz.find({ status: true });
  const nonActiveQuiz = await Quiz.find({ status: false });
  const data = {
    active: activeQuiz.length,
    nonActive: nonActiveQuiz.length
  };
  return res.status(200).json({
    success: 1,
    data
  });
});

// Active and Non-Active quizes
exports.getAllQuizDetails = asyncHandler(async (req, res, next) => {
  const quizes = await Quiz.find().lean();
  for (const quize of quizes){
    const attempts = await Attempt.find({ quizId: quize._id });
    quize.attempts = attempts;
    let correct = 0;
    let wrong = 0;
    attempts.forEach((attempt) => {
      if (attempt.attempt === true) correct = correct + 1;
      else wrong = wrong + 1;
    });
    let passRate = 0;
    if (correct !== 0) passRate = ((correct/attempts.length) * 100).toFixed(1);
    let plays = 0;
    if(quize.questionIds.length)
      plays = attempts.length >= quize.questionIds.length ? (attempts.length/quize.questionIds.length).toFixed(0) : attempts.length;
    quize.plays = plays;
    let avgScore = passRate/plays;
    quize.avgScore = avgScore?avgScore.toFixed(1):0;
    quize.avgTime = plays?Math.floor(Math.random() * 5)+'m '+Math.floor(Math.random() * 60)+'s': '0m 0s';
  }
  return res.status(200).json({
    success: 1,
    quizes
  });
});
exports.checkSlug = asyncHandler(async (req, res, next) => {
    const { slugStr } = req.body;
    const quiz = await Quiz.find({
      slug: slugStr
    });

    console.log(req.body); 
    if(quiz.length == 0) {
      return res.status(200).json({
        message: "all good",
        slug: slugStr
      });
    } else {
      console.log('what ');
      return res.status(501).json({
        message: "slug already exists"
      });
    }
});