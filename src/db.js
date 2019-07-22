const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.DATABASE_URL;

  console.log(`connectDB url=${uri}`);
  return mongoose.connect(uri);
};

module.exports = {
  connectDB,
};
