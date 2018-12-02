const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const key = require("./setup/url").secret;
const db = require("./setup/url").mongoURL;
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// Import Routes for Usage..
const auth = require("./routes/api/auth");
const student = require("./routes/api/student");

// Create a Session for Admin..
app.use(
  session({
    secret: key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 604800000, // 1 Week
      httpOnly: true
    }
  })
);

app.use(cookieParser());
app.use("/myuploads", express.static("./public/myuploads/"));

// Passport Middleware.
app.use(passport.initialize());

//Config for JWT Strategy.
require("./strategies/jsonwtStrategy")(passport);

// Connection to the Database..
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected Succesfully."))
  .catch(err => console.log(err));

app.set("view engine", "ejs");

// Middleware for Body-Parser.
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Usage of Routes.
app.use("/auth", auth);
app.use("/student", student);

app.get("/", (req, res) => {
  res.redirect("/auth");
});
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
