require("dotenv").config();

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    dotenv         = require('dotenv');
    flash          = require("connect-flash"),
    methodOverride = require("method-override"),
    Comment        = require("./models/comment"),
    Campground     = require("./models/campground"),
    User           = require("./models/user"),
    seedDb         = require("./seeds");

dotenv.config();    
var url = process.env.MONGODB_URI;

    //REQUIRING ROUTES
var commentRoutes        = require("./routes/comments"),
    campgroundRoutes     = require("./routes/campgrounds"),
    reviewRoutes     = require("./routes/reviews"),
    indexRoutes          = require("./routes/index")

mongoose.connect(url,
                 {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() =>{
                     console.log("Connected to Database!");
                 }).catch(err => {
                     console.log("ERROR", err.message);
                 });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDb();

//  PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/campgrounds", campgroundRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);