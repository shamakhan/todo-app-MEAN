const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  name: {
    type: "String"
  },
  username: {
    type: "String",
    required: true,
    index: true
  },
  email: {
    type: "String",
    required: true,
  },
  password: {
    type: "String",
    required: true,
  }
});

const User = module.exports = mongoose.model("user", UserSchema);

module.exports.getUserByUsername = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.addUser = (user, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      user.save(callback);
    })
  })
};

module.exports.comparePassword = (userPassword, hash, callback) => {
  bcrypt.compare(userPassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(isMatch);
  });
};