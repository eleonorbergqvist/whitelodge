const mongoose = require('mongoose');

const connectDB = () => {
  console.log(`connectDB url=${process.env.DATABASE_URL}`);
  return mongoose.connect(process.env.DATABASE_URL);
};

module.exports = {
  connectDB,
};
