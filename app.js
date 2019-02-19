const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const keys = require("./config/keys");

const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const poem = require("./routes/api/poem");
const comment = require("./routes/api/comment");
const like = require("./routes/api/like");
const follow = require("./routes/api/follow");
const images = require("./routes/api/images");

const app = express();

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("Db connected"))
  .catch(err => console.log(err));

app.use(
  "/public/images",
  express.static(path.join(`${__dirname}/public/images`))
);

app.use(express.urlencoded());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/poem", poem);
app.use("/api/comment", comment);
app.use("/api/like", like);
app.use("/api/follow", follow);
app.use("/api/image", images);

app.listen(5000, () => console.log("Server started on port 5000"));
