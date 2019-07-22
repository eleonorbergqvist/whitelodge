const mongoose = require("mongoose");

const accomodationSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  }
});

module.exports = mongoose.model("accomodation", accomodationSchema);
