const express = require("express");
const {
  createQuiz,
  getAllQuiz,
  getQuizById,
  updateQuizById,
  deleteQuizById,
  setQuizStatus,
  getQuizStats,
  getAllQuizDetails,
  checkSlug,
  getQuestions
} = require("../controllers/quiz");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/quiz:
 *  post:
 *    tags:
 *     - Quiz
 *    description: Creates a new quiz
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: body
 *       name: quizData
 *       description: The Quiz object to create
 *       schema:
 *         type: object
 *         required:
 *           - name
 *             description
 *             questionIds
 *             status
 *         properties:
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           questionIds:
 *             type: array
 *           status:
 *             type: boolean
 *    responses:
 *      '201':
 *        description: Quiz Created
 *      '409':
 *        description: Quiz already exists
 *      '400':
 *        description: Bad request
 */
router.post("/", protect, authorize("admin"), createQuiz);
router.post('/slug', protect, authorize("admin"), checkSlug);
router.get('/link/:slug', getQuestions);
/**
 * @swagger
 * /api/quiz:
 *  get:
 *    tags:
 *     - Quiz
 *    description: Get All Quiz's
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", protect, authorize("admin"), getAllQuiz);
/**
 * @swagger
 * /api/quiz/{id}:
 *  get:
 *    tags:
 *     - Quiz
 *    description: Get a quiz by ID
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */
router.get("/:id", protect, authorize("admin", "employee"), getQuizById);

/**
 * @swagger
 * /api/quiz/all/stats:
 *  get:
 *    tags:
 *     - Quiz
 *    description: Get Quiz Stats (Active/Non-Active)
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */
router.get("/all/stats", protect, authorize("admin"), getQuizStats);

/**
 * @swagger
 * /api/quiz/all/details:
 *  get:
 *    tags:
 *     - Quiz
 *    description: Get Quiz details (Name, attempts and other stuff)
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */
router.get("/all/details", protect, authorize("admin"), getAllQuizDetails);

/**
 * @swagger
 * /api/quiz/{id}:
 *  put:
 *    tags:
 *     - Quiz
 *    description: Update a Quiz by ID
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: body
 *       name: quizData
 *       description: The Quiz object to create
 *       schema:
 *         type: object
 *         required:
 *           - name
 *             description
 *             questionIds
 *             status
 *         properties:
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           questionIds:
 *             type: array
 *           status:
 *             type: boolean
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '201':
 *        description: Quiz Updated
 *      '409':
 *        description: Quiz already exists
 *      '400':
 *        description: Bad request
 */
router.put("/:id", protect, authorize("admin"), updateQuizById);
/**
 * @swagger
 * /api/quiz/status/{id}:
 *  put:
 *    tags:
 *     - Quiz
 *    description: Update Quiz Status
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: body
 *       name: quizData
 *       description: The Quiz object to create
 *       schema:
 *         type: object
 *         required:
 *             status
 *         properties:
 *           status:
 *             type: boolean
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '201':
 *        description: Quiz status Updated
 *      '400':
 *        description: Bad request
 */
router.put("/status/:id", protect, authorize("admin"), setQuizStatus);
/**
 * @swagger
 * /api/quiz/{id}:
 *  delete:
 *    tags:
 *     - Quiz
 *    description: Delete Quiz by ID
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '204':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */

router.delete("/:qid", protect, authorize("admin"), deleteQuizById);

module.exports = router;
