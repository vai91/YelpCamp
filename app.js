var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
//requiring routes    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v13", { useNewUrlParser: true });
mongoose.connect("mongodb://efe:648599Ef_@ds131753.mlab.com:31753/celpyamp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
    //this is safer than just ("public")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();    // seed the db

// PASSPORT CONFIGURATION
app.use(require("express-session")({
        //never show this!! this is what handles the encryption of your cookie information.
    secret: "Once again, fuck Rusty!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//we add our own middleware. Whatever func we provide to it, will be called on every route.
app.use(function(req, res, next){
    //whatever we put on res.locals is what is available in the template 
    res.locals.currentUser          = req.user;
    //we want message to be available everywhere because it is in being used in header.ejs
    res.locals.errorMessage         = req.flash("error");
    res.locals.successMessage       = req.flash("success");
    //then we move on to actual next code.
    next();
});

// This tells our app to use those 3 route files that we required at top.
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server has started, and is listening..."); 
});