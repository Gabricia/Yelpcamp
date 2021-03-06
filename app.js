require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");
const Comment = require("./models/comment");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/index");
const reviewRoutes = require("./routes/review");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const port = process.env.PORT || 3000;
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
//seedDB();

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "This is the secret encrypter",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(port, function () {
  console.log("Yelpcamp Server has started");
});
