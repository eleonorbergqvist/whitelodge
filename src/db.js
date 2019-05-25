const mongoose = require('mongoose');

const connectDB = () => {
  console.log("connectDB");
  console.log(process.env.DATABASE_URL);
  return mongoose.connect(process.env.DATABASE_URL);
};

module.exports = {
  connectDB,
};