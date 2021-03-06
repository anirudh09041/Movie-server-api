const express = require("express");
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const cors = require("cors");
const movieRoute = require("./route/movie");
const userRoute = require("./route/user");
const path = require("path");

const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
  })
);

const dbURI =
  "mongodb+srv://demo:demo123123@apiserver.wb9gr.mongodb.net/APIserver?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to the database.."))
  .catch((err) => console.log(err));

app.use("/movie", movieRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log("server running at port " + port + " .....");
});
