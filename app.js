const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const config = require("./config/app");
const userRoutes = require("./routes/users");

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("Db connected successfully. " + config.database);
})
mongoose.connection.on("error", (err) => {
  console.log("Db connection error: " + err);
});
mongoose.set('useCreateIndex', true);

// Set up server
const app = express();
const appUrl = process.env.APP_URL || "http://localhost";
const port = process.env.PORT || 3000;

// Register Middlewares
// app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server started on ${appUrl}:${port}`);
});