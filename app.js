var express                 = require("express");
var app                     = express();
var mongoose                = require("mongoose");
mongoose.Promise            = require("bluebird");//--using bluebird promises installed instead of native ES6 for 4X speed
var passport                = require("passport");
var bodyParser              = require("body-parser");
var User                    = require("./models/user");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://admin:root@ds023704.mlab.com:23704/auth_demo");

//-------------------------------------------------------//
// USE SECTION
//-------------------------------------------------------//

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret: "famjam",
  resave: false,
  saveUninitialized: false
}));
//==The 2 lines of code below are required to init passport in any app==//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//this codes encodes the data and puts it back in the session
passport.serializeUser(User.serializeUser());
//this reads the sessions encoded data and decodes it
passport.deserializeUser(User.deserializeUser());

//-------------------------------------------------------//
// ROUTES SECTION
//-------------------------------------------------------//

app.get("/", function(req,res){
  res.render("home");
});

//isLoggedIn below is middleware to prevent user from accessing secret w/out logging in
app.get("/secret", isLoggedIn, function(req,res){
  res.render("secret");
});

app.get("/register", function(req,res){
  res.render("register");
})

app.post("/register", function(req,res){
  req.body.username
  req.body.password
  //creating a new user and saving to database
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    //passport.authenticate will check for the user we just created and if it exists in the db it will then auth
    passport.authenticate("local")(req, res, function(){  //this logs the user in
      res.redirect("/secret");
    });
  });
});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,function(req,res){
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});


// defining a middleware function to use before allowing someone to get "secret" page
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Server listening on port 3000");
});

////////// for production  //////////////
// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log("Server listening on port");
// });
