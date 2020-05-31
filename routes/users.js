const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const config = require("../config/app");
const User = require("../models/user");

router.post("/register", (req, res, next) => {
  const errors = validateRegisterRequest(req.body);
  if (errors.length) {
    res.json({ status: "failure", errors: errors });
    return;
  }
  User.getUserByUsername(req.body.username, (err, existingUser) => {
    if (err) throw err;
    if (existingUser) {
      res.send({ status: "failure", message: "User already exists with this username. Please choose a unique username" });
      return;
    }
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
      if (err) throw err;
      if (!user) {
        res.json({ status: "failure", message: "Failed to add user" });
      } else {
        res.json({ status: "success", message: "User added successfully" });
      }
    });
  });
});

router.post("/login", (req, res, next) => {
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({ status: "failure", message: "Invalid credentials" });
    } else {
      User.comparePassword(req.body.password, user.password, (isMatch) => {
        if (!isMatch) {
          res.json({ status: "failure", message: "Invalid credentials" });
        } else {
          const token = jwt.sign(user.toJSON(), config.token.secret, {
            expiresIn: 86400, // 2 days 
          });
          res.json({
            status: "success",
            token: "JWT " + token,
            expiresIn: 86400,
            user: {
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        }
      })
    }
  })
});

router.get("/dashboard", passport.authenticate("jwt", { session: false }), (req, res, next) => {
  res.send("DASHBOARD");
});

const validateRegisterRequest = (details) => {
  const errors = [];
  if (!details.username) {
    errors.push("Username is required");
  }
  if (!details.email) {
    errors.push("Email is required");
  }
  if (!details.password) {
    errors.push("Password is required");
  }
  return errors;
}

module.exports = router;