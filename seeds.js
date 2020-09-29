const mongoose = require("module");
const Campground = require("./models/campground");

const Comment = require("./models/comment");

var data = [
  {
    name: "Cloud Rest",
    image:
      "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur maximus justo sit amet efficitur. Vivamus ullamcorper varius consequat. Maecenas condimentum tincidunt urna, ac feugiat arcu tempus a. Donec venenatis eget nibh et pulvinar. Duis volutpat diam in nisl condimentum, sed finibus elit pharetra. Nam augue sem, consectetur at felis sit amet, iaculis facilisis eros. Mauris lectus mauris, placerat convallis purus ac, molestie commodo nulla. Praesent non eleifend mi. Maecenas nec libero sodales, viverra purus a, maximus dui. Curabitur fermentum odio ut malesuada viverra. Phasellus molestie iaculis nibh, ac iaculis dolor posuere eget. Integer porta justo quis sem consectetur luctus.",
  },
  {
    name: "Fire Rest",
    image:
      "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&h=350",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur maximus justo sit amet efficitur. Vivamus ullamcorper varius consequat. Maecenas condimentum tincidunt urna, ac feugiat arcu tempus a. Donec venenatis eget nibh et pulvinar. Duis volutpat diam in nisl condimentum, sed finibus elit pharetra. Nam augue sem, consectetur at felis sit amet, iaculis facilisis eros. Mauris lectus mauris, placerat convallis purus ac, molestie commodo nulla. Praesent non eleifend mi. Maecenas nec libero sodales, viverra purus a, maximus dui. Curabitur fermentum odio ut malesuada viverra. Phasellus molestie iaculis nibh, ac iaculis dolor posuere eget. Integer porta justo quis sem consectetur luctus.",
  },
  {
    name: "Water Rest",
    image:
      "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur maximus justo sit amet efficitur. Vivamus ullamcorper varius consequat. Maecenas condimentum tincidunt urna, ac feugiat arcu tempus a. Donec venenatis eget nibh et pulvinar. Duis volutpat diam in nisl condimentum, sed finibus elit pharetra. Nam augue sem, consectetur at felis sit amet, iaculis facilisis eros. Mauris lectus mauris, placerat convallis purus ac, molestie commodo nulla. Praesent non eleifend mi. Maecenas nec libero sodales, viverra purus a, maximus dui. Curabitur fermentum odio ut malesuada viverra. Phasellus molestie iaculis nibh, ac iaculis dolor posuere eget. Integer porta justo quis sem consectetur luctus.",
  },
];

//remove all camprounds
function seedDB() {
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("remove campgrounds");
    //create campground
    data.forEach(function (seed) {
      Campground.create(seed, function (err, campground) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
          //create comment
          Comment.create(
            {
              text: "This place is great but not internet",
              author: "Homer",
            },
            function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment");
              }
            }
          );
        }
      });
    });
  });
}

//add a few comments

module.exports = seedDB;
