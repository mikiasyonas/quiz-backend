const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = "mongodb+srv://admin:vzzGN4cZQD4WGZnA@cluster0.fn8gb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const MONGO_URI_LOCAL="mongodb://localhost/quizManagement";
  const conn = await mongoose.connect(MONGO_URI_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
