const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({ userName: login });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
