// MOVIE ROUTES HANDLER

const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const MovieInfo = require("../models/movie");

const router = express.Router();

router.post("/add-movie", (req, res) => {
  const Movie = new MovieInfo({
    name: req.body.name,
    img: req.body.img,
    summary: req.body.summary,
  });

  Movie.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

router.get("/all-movies", (req, res) => {
  MovieInfo.find()
    .then((result) => {
      // storing the result in a file "MoviesList.txt"
      fs.appendFile("MoviesList.txt", result, function (err) {
        if (err) throw err;
        console.log(" File Saved!");
      });
      res.send(result);
    })
    .catch((err) => console.log(err));
});

router.put("/:name", (req, res) => {
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

router.delete("/:name", (req, res) => {
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
