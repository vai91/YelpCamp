var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
// index.js is a special file name. express automatically searches for it under /middleware folder, so I do not specify that.
var middleware  = require("../middleware");

//INDEX route - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("ERROR OCCURED");
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
        }
    });
    
});

//CREATE route - add new campgrounds to the db
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image; 
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author:author};
    //info about the currently logged in user
    console.log(req.user);
    //Create a new campground and save it into DB
    Campground.create(newCampground, function(err, newlyCreatedCampground){
        if(err){
            console.log(err);
        }else{
            console.log("Campground added!");
            console.log(newlyCreatedCampground);
            res.redirect("/campgrounds");
        }
    }
    );
    
});

//NEW route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route - shows more info about one campground
//this route should come AFTER "/campgrounds/new" otherwise /new wont show the form.
router.get("/:id", function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
    //render show template with that campground
        res.render("campgrounds/show", {campground:foundCampground});
        }
    });
    
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(err, foundCampground){
         //at this point, there should not be an error, because we already did it in the middleware, so I will omit it.
         res.render("campgrounds/edit", {campground:foundCampground});
        });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
       } else {
            res.redirect("/campgrounds/"+ updatedCampground._id);
       }
    });
    //redirect somewhere
    
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
            console.log(err);
            res.redirect("/campgrounds");
      } else { 
            res.redirect("/campgrounds");
      }
   }); 
});


module.exports = router;