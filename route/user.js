// USER ROUTES HANDLER

const express = require("express");
const mongoose = require("mongoose");
const UserInfo = require("../models/user");
const brcypt = require("bcrypt");
const router = express.Router();

router.post("/", (req, res) => {
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

router.get("/all-users", (req, res) => {
  UserInfo.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;

// password of user is not stored in plain text therefore using bcrypt
