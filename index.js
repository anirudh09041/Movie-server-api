const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const movieRoute = require("./route/movie");
const userRoute = require("./route/user");

const app = express();
app.use(express.json());
app.use(cors());

const dbURI =
  "mongodb+srv://demo:demo123123@apiserver.wb9gr.mongodb.net/APIserver?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to the database.."))
  .catch((err) => console.log(err));

app.use("/movie", movieRoute);
app.use("/user", userRoute);

app.listen(8080, () => {
  console.log("server running at port 8080 .....");
});
