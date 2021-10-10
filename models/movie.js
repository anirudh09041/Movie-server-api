const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  //_id: mongoose.Schema.Types.ObjectId
  // if explicitly declared then
  // must be initialized explicitly.
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
});

const MovieInfo = mongoose.model("MovieInfo", movieSchema);
module.exports = MovieInfo;
