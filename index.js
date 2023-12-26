const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const taskRoute = require("./routes/tasks");
const port = process.env.PORT || 4000;
const mongoDBURL = process.env.mongoDBURL;
console.log("MongoDB URL:", mongoDBURL);
const authRoute = require("./routes/auth");
const taskWithPicture = require("./routes/upload-pic");
const path = require("path");
const cors = require("cors");
app.use(cors());

mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to the database!");
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Serve static files before applying JSON request body parsing middleware
app.use(express.static(path.join(__dirname, "public")));

// Apply the JSON request body parsing middleware
app.use(express.json());

// Register the user registration route and tasks route using app.use()
app.use("/v1/auth", authRoute);
app.use("/v1/tasks", taskRoute);
app.use("/v1/upload-pic", taskWithPicture);

app.listen(port, () => {
  console.log("Listening on port", port);
});
