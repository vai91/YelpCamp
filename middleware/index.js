var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
// All the Middleware goes here
var middlewareObj   = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
        if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
                console.log(err);
                req.flash("error", "Campground not found in db.");
                res.redirect("back");
           } else {
                //does the user own the campground?
                //here === is not used, because foundCampground.author.id is an object, while req.user._id is a String.
                //.equals is a mongoose method, which helps us eliminate this kind of issues.
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that, campground does not belong to you.");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
    
middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
                console.log(err);
                req.flash("error", "Campground not found in db.");
                res.redirect("back");
           } else {
                //does the user own the campground?
                //here === is not used, because foundCampground.author.id is an object, while req.user._id is a String.
                //.equals is a mongoose method, which helps us eliminate this kind of issues.
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that, comment does not belong to you.");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //just adding this line wont display anything for us, it only gives us the capability.
    //error is type of message(key), it is red this case, since this is an error.
    //message is value, and it says what we want to show to the users
    //flash shows the message on the redirected page, and if that page is refreshed, it dissappears.
    //So, certain conditions, in our case this middleware here should evaluate to false in order flash to work.
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;
