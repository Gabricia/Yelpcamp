const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const localStrategy = require("passport-local");

//===========
//AUTH ROUTES
//===========

//LANDING PAGE ROUTE
router.get("/", function (req, res) {
  res.render("landing");
});

//show register form
router.get("/register", (req, res) =>
  res.render("register", { page: "register" })
);

//handle sign up logic route
router.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Bienvenue sur YelpCamp, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", (req, res) => res.render("login", { page: "login" }));

//handle login logic route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//logout route
router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success", "Vous êtes déconnecté");
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
