var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
//root route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form route
router.get("/register", function(req, res) {
   res.render("register", {page: 'register'}); 
});
// handle user signup logic route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp" + user.username);
           res.redirect("/campgrounds");
       });   
    });
});

// show login form route
router.get("/login", function(req, res) {
    //we have a message variable(errorMessage&successMessage) exposed with res.locals.message, and req.flash defined on the isLoggedIn middleware. so we don't pass any object here or define req.flash
    res.render("login", {page: 'login'});
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {//.authenticate method will take req.body.password and req.body.username from the login form, and it will authenticate them with what we have in the db for that user.
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});
// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    //flash needs to be declared before the redirect!
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;