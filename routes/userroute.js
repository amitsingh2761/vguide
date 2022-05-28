const express = require("express");
const Router = express.Router();
const User = require("../models/user");
const Place = require("../models/places");
const Review= require("../models/review");

const app = express();
const path = require('path');
const catchAsync = require("../errorhandler/catchAsync");
const passport = require("passport");
const {profession}=require("../seeds/profession"); 
const { isLoggedIn } = require("../authentication/authentication");
app.set('views', path.join(__dirname, 'views'))


//homepage

Router.get("/home", (req, res) => {
    res.render("home.ejs")
})

//profile

Router.get("/profile",isLoggedIn, async(req, res) => {
    const user=await User.findById(req.user._id);
const places=await Place.find({author:req.user._id});
const reviews=await Review.find({author:req.user._id});

    res.render("user/profile.ejs",{user,places,reviews});
})

//insert user data
Router.get("/userdata",isLoggedIn,(req,res)=>{
    res.render("user/userdata.ejs",{profession});
})

//uploading user data
Router.post("/user",isLoggedIn,async(req,res)=>{
 
    const user=await User.findByIdAndUpdate(req.user._id,{...req.body});
  
   await user.save();
console.log(user);

res.redirect("/profile")
})




//register
Router.get("/register", (req, res) => {
    res.render("user/register.ejs")
})
//register part2
Router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ username, email });
        const registerUser = await User.register(user, password);
        req.login(registerUser, (err) => {//used to automatically login registered user
            if (err) { return next(err); }
            else {
                req.flash("success", `Welcome ${user.username}`);
                
                res.redirect("/place");
            }
        })

    } catch (e) {
        req.flash("danger", "user already registered")
        res.redirect("/register")
    }
}))

//login
Router.get("/login", (req, res) => {
    res.render("user/login.ejs");
  
    
})
Router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", `welcome ${req.body.username}`)
    const redirectUrl = req.session.returnTo || "/place";//to return to page where authenticated
    delete req.session.returnTo;
    res.redirect(redirectUrl);

})
//log out
Router.get("/logout", (req, res) => {
    req.logout();//inbuild passport function
    req.flash("success", "User logged out");
    res.redirect("/place")
})



module.exports = Router;
