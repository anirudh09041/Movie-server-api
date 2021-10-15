// MOVIE ROUTES HANDLER
//=================================================

const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const MovieInfo = require("../models/movie");
const checkAuth = require("../middleware/check-auth");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmurbyjhs",
  api_key: "673265135469578",
  api_secret: "t8WmrcEvi52A_E3m4miPqnDFUWI",
});

const router = express.Router();

//to get the list of all movies present in the database
// checkauth middleware is not added here to allow everyone to view the list
router.get("/all-movies", (req, res) => {
  MovieInfo.find()
    .then((result) => {
      // storing the result in a file "MoviesList.txt"
      // fs.appendFile("MoviesList.txt", result, function (err) {
      // if (err) throw err;
      // console.log(" File Saved!");
      res.send(result);

      // res.send(result);
    })
    .catch((err) => console.log(err));
});

// to add a new movie to the database
router.post("/add-movie", checkAuth, (req, res) => {
  // photo is name of property whose value will be img
  const file = req.files.photo;

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    // console.log(result);
    const Movie = new MovieInfo({
      name: req.body.name,
      // request.url is url of img uploaded on cloudinary
      // this url will now be uploaded to mongoDB database
      img: result.url,
      summary: req.body.summary,
    });
    Movie.save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });
});

// to update a movie from the database
router.put("/:name", checkAuth, (req, res) => {
  MovieInfo.findOneAndUpdate(
    { name: req.params.name },
    {
      $set: {
        name: req.body.name,
        img: req.body.img,
        summary: req.body.summary,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        updated_Movie: result,
      });
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({
        error: err,
      });
    });
});

// to delete a movie from the database
router.delete("/:name", checkAuth, (req, res) => {
  MovieInfo.deleteOne({ name: req.params.name })
    .then((result) => {
      res.status(200).json({
        message: "movie removed",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "error",
        error: err,
      });
    });
});

module.exports = router;
