const express = require("express");
const mongoose = require("mongoose");
const MovieInfo = require("./models/movie");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
// app.use(express.urlencoded());
app.use(cors());

const dbURI =
  "mongodb+srv://demo:demo123123@apiserver.wb9gr.mongodb.net/APIserver?retryWrites=true&w=majority";

//  we could use regular mongodb api to make queries to database but its too complicated instead we could  mongoose.
// mongoose is an ODM library Object Document Mapping

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to the database.."))
  .catch((err) => console.log(err));

// app.get("/add-movie", (req, res) => {
//   const Movie = new MovieInfo({
//     name: "The Lord of the Rings: The Fellowship of the Ring",
//     img: "https://bit.ly/2tC1Lcg",
//     summary:
//       "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.",
//   });

//   Movie.save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => console.log(err));
// });

app.post("/add-movie", (req, res) => {
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

app.get("/all-movies", (req, res) => {
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

app.put("/:name", (req, res) => {
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

app.delete("/:name", (req, res) => {
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

app.listen(8080, () => {
  console.log("server running at port 8080 .....");
});
