// USER ROUTES HANDLER

const express = require("express");
const mongoose = require("mongoose");
const UserInfo = require("../models/user");
const brcypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

router.get("/all-users", (req, res) => {
  UserInfo.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

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

// router.post("/login", async (req, res) => {
//   await UserInfo.find({ username: req.body.username })
//     .exec()
//     .then((user) => {
//       if (user.length < 1) {
//         // if user array is empty
//         return res.send("user not found!");
//       }
//       bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//         if (!result) {
//           // if no result
//           return res.send("wrong password");
//         }
//         if (result) {
//           // if result found we will send token to the user
//           const token = jwt.sign(
//             {
//               username: user[0].username,
//               usertype: user[0].usertype,
//               email: user[0].email,
//               phone: user[0].phone,
//             },
//             "mynameisanirudhkaushalandthisismysecretkey",
//             {
//               expiresIn: "24h",
//             }
//           );
//           res.status(200).json({
//             username: user[0].username,
//             usertype: user[0].usertype,
//             email: user[0].email,
//             phone: user[0].phone,
//             // token: token,
//           });
//         }
//       });
//     })
//     .catch((err) => {
//       res.status(500).json *
//         {
//           err: err,
//         };
//     });
// });

module.exports = router;

// password of user is not stored in plain text therefore using bcrypt
