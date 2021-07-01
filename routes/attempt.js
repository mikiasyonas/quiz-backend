const express = require("express");
const { createAttempt, getAllAttempts } = require("../controllers/attempt");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/attempt:
 *  post:
 *    tags:
 *     - Attempt
 *    description: Creates a new attempt
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *     - in: body
 *       name: attemptData
 *       description: The attempt to create
 *       schema:
 *         type: object
 *         required:
 *           - quizId
 *             questionId
 *             answer
 *         properties:
 *           quizId:
 *             type: string
 *           questionId:
 *             type: string
 *           answer:
 *             type: string
 *    responses:
 *      '201':
 *        description: Attempt created
 *      '409':
 *        description: Attempt already exists
 *      '400':
 *        description: Bad request
 */
router.post("/", protect, authorize("admin", "employee"), createAttempt);
/**   
 * @swagger
 * /api/attempt:
 *  get:
 *    tags:
 *     - Attempt
 *    description: Use to get all attempts
 *    parameters:
 *     - in: header
 *       name: authorization
 *       description: An authorization header (Bearer {{JWT}})
 *       type: String
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", protect, authorize("admin"), getAllAttempts);
module.exports = router;
