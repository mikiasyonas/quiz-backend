const mongoose = require("mongoose");

const connectDB = async () => {
  // const MONGO_URI = "mongodb+srv://admin:vzzGN4cZQD4WGZnA@cluster0.fn8gb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const MONGO_URI_LOCAL="mongodb://localhost/quizManagement";
  MONGO_URI="mongodb+srv://dreamer512:Mikias.Yonas@quiz-management.iqi6d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const conn = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
