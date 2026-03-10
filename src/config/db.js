const mongoose = require("mongoose");

// This function connects our app to MongoDB database
const connectDB = async () => {
  try {
    // mongoose.connect reads the MONGO_URI from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, print error and stop the app
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // exit code 1 means "stopped due to error"
  }
};

module.exports = connectDB;
