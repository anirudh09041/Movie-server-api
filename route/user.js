// USER ROUTES HANDLER

const express = require("express");
const mongoose = require("mongoose");
const UserInfo = require("../models/user");
const brcypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

// for sign up / register a new user
// username
// password
// phone
// email
// usertype  are required

router.post("/signup", (req, res) => {
  brcypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new UserInfo({
        username: req.body.username,
        password: hash,
        phone: req.body.phone,
        email: req.body.email,
        usertype: req.body.usertype,
      });

      user
        .save()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

// to get the list of all users

router.get("/all-users", (req, res) => {
  UserInfo.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

// to login only email and password are required in the body

router.post("/login", async (req, res) => {
  // finding the user by his email ID
  const user = await UserInfo.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found!");

  //verifing the passoword
  // the request body will contain email and password
  // {
  //   "email":"ak@gmail.com",
  //   "password":"akgibrish"
  // }
  const validPass = await brcypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  // creating and assigning a json web token (JWT)
  // using _id and email for creating token

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    "mynameisanirudh"
  );

  //sending token to the user
  res.header("auth-token", token).send(token);
});

module.exports = router;

// password of user is not stored in plain text therefore using bcrypt
