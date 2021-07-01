const express = require("express");
const {
  getAllResults,
  getScorebyEmployee,
  getEmployeeAttemptStats,
  getQuizStats,
  getResultsByQuizId
} = require("../controllers/result");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/result:
 *  get:
 *    tags:
 *     - Result
 *    description: Get All Results
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get("/", protect, authorize("admin"), getAllResults);
/**
 * @swagger
 * /api/result/employee/{id}:
 *  get:
 *    tags:
 *     - Result
 *    description: Get results by Employee ID
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
router.get(
  "/employee/:id",
  protect,
  authorize("admin", "employee"),
  getScorebyEmployee
);
/**
 * @swagger
 * /api/result/employee/all/stats:
 *  get:
 *    tags:
 *     - Result
 *    description: Get All Attempt Stats by Users
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get(
  "/employee/all/stats",
  protect,
  authorize("admin", "employee"),
  getEmployeeAttemptStats
);

/**
 * @swagger
 * /api/result/quiz/stats:
 *  get:
 *    tags:
 *     - Result
 *    description: Get Quiz Result Stats
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get("/quiz/stats", protect, authorize("admin"), getQuizStats);

// router.delete("/:qid", deleteQuestion);

module.exports = router;
