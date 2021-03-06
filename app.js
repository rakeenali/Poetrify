const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const helmet = require("helmet");
// const sticky = require("sticky-session");

const keys = require("./config/keys");

const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const poem = require("./routes/api/poem");
const comment = require("./routes/api/comment");
const like = require("./routes/api/like");
const follow = require("./routes/api/follow");
const images = require("./routes/api/images");
const notification = require("./routes/api/notification");
const conversation = require("./routes/api/conversation");
const recomendationRoute = require("./routes/api/recomendation");
const groupRoute = require("./routes/api/group");
const searchRoute = require("./routes/api/search");
const blockRoute = require("./routes/api/block");

const app = express();

const server = http.createServer(app);
const io = socketIO.listen(server);

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("Db connected"))
  .catch(err => console.log(err));

app.use(
  "/public/images",
  express.static(path.join(`${__dirname}/public/images`))
);

app.use(express.urlencoded());
app.use(express.json());

// Realtime
const Notifications = require("./realtime/Notifications");
const notifications = new Notifications(io);

app.use(function(req, res, next) {
  req.notification = notifications;
  next();
});

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/poem", poem);
app.use("/api/comment", comment);
app.use("/api/like", like);
app.use("/api/follow", follow);
app.use("/api/image", images);
app.use("/api/notification", notification);
app.use("/api/conversation", conversation);
app.use("/api/recomendation", recomendationRoute);
app.use("/api/group", groupRoute);
app.use("/api/search", searchRoute);
app.use("/api/block", blockRoute);

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));
