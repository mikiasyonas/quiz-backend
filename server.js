const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "config/config.env" });

// Connect to database
connectDB();
const app = express();
app.use(methodOverride("_method"));
// Route files

// Enable CORS
app.use(cors());

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Quiz API",
      description: "API for Quiz built in Nodejs",
      servers: [`http://localhost:${process.env.PORT}`]
    }
  },
  apis: [
    "server.js",
    "routes/auth.js",
    "routes/question.js",
    "routes/attempt.js",
    "routes/quiz.js",
    "routes/result.js",
    "routes/poster.js"
  ],
  components: {
    bearerAuth: {
      type: "http",
      schema: "bearer",
      bearerFormat: "JWT"
    }
  },
  security: {
    bearerAuth: []
  }
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const auth = require("./routes/auth");
const question = require("./routes/question");
const quiz = require("./routes/quiz");
const attempt = require("./routes/attempt");
const poster = require("./routes/poster");
const result = require("./routes/result");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
// app.use("/api/v1/auth", auth);
// /**
//  * @swagger
//  * /api/auth/users:
//  *  get:
//  *    description: Use to request all customers
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  */
app.use("/api/auth", auth);
app.use("/api/question", question);
app.use("/api/quiz", quiz);
app.use("/api/attempt", attempt);
app.use("/api/poster", poster);
app.use("/api/result", result);

app.use(express.static('public'))

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
