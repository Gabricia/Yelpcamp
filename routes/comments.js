const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//==================
//COMMENT ROUTES
//==================

//CREATE A NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//handle new comment logic route
router.post("/", middleware.isLoggedIn, function (req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      req.flash("error", err);
      res.redirect("/campgrounds");
    } else {
      //create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error", err);
        } else {
          //ad username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          //redirect campground show page
          req.flash("success", "Commentaire ajouté");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (
  req,
  res
) {
  //find and update the correct comment
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      //redirect to show page
      req.flash("success", "Commentaire mis à jour");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Commentaire supprimé");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
