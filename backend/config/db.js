const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://rajc07168_db_user:rkA4nWF4yyFBX3rm@cluster0.ct2tdv8.mongodb.net/?appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" Database connection failed:");
    console.error(error.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
