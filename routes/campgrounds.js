const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const middleware = require("../middleware");
const Comment = require("../models/comment");

//==================
//CAMPGROUNDS ROUTES
//==================

//INDEX SHOW ALL CAMPGROUNDS ROUTE
router.get("/", function (req, res) {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    //Get all campground from DB corresponding to the search
    Campground.find({ name: regex }, function (err, campgrounds) {
      if (err) {
        res.redirect("back");
      } else {
        if (campgrounds.length < 1) {
          noMatch = "Aucun camping correspondant.";
        }
        res.render("campgrounds/index", {
          campgrounds: campgrounds,
          currentUser: req.user,
          page: "campgrounds",
          noMatch: noMatch,
        });
      }
    });
  } else {
    //Get all campground from DB
    Campground.find({}, function (err, campgrounds) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("campgrounds/index", {
          campgrounds: campgrounds,
          currentUser: req.user,
          page: "campgrounds",
          noMatch: noMatch,
        });
      }
    });
  }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    price: price,
    description: desc,
    author: author,
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//SHOW ROUTE- shows more info about one campground
router.get("/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
    })
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  delete req.body.campground.rating;
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("back");
    } else {
      //redirect to show page
      req.flash("success", "Camping mis à jour");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      // deletes all comments associated with the campground
      Comment.remove({ _id: { $in: campground.comments } }, function (err) {
        if (err) {
          console.log(err);
          return res.redirect("/campgrounds");
        }
        // deletes all reviews associated with the campground
        Review.remove({ _id: { $in: campground.reviews } }, function (err) {
          if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
          }
          //  delete the campground
          campground.remove();
          req.flash("success", "Camping supprimé");
          res.redirect("/campgrounds");
        });
      });
    }
  });
});

//REGEX FOR FUZZY SEARCH
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
