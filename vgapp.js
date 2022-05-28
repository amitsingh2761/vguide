if (process.env.NODE_ENV !== "production") {// environment variables accessing for uploading files
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Place = require('./models/places');
const Review = require('./models/review');
const City = require('./models/city');
const ejsMate = require("ejs-mate");
const catchSync = require("./errorhandler/catchAsync");
const expressError = require("./errorhandler/expressError");
const isLoggedIn = require("./authentication/authentication")


const UserRoute = require("./routes/userroute");
const PlaceRoute = require('./routes/placeroute');
const ReviewRoute = require('./routes/reviewroute');
const CityRoute = require('./routes/cityroute');



const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoDBStore = require("connect-mongo");


// mongodb+srv://firstuser:<password>@cluster0.3cg4j.mongodb.net/?retryWrites=true&w=majority
const db_url=process.env.DBURL;
//  || 'mongodb://localhost:27017/Vguide';
// 'mongodb://localhost:27017/Vguide'
// db_url
mongoose.connect(db_url, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine("ejs", ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })); //parse the req.body or bofy parser
app.use(methodOverride('_method'));


// const store=new MongoDBStore({
//     url:db_url,
//     secret: "mynameisdante",
//     touchAfter:24*60*60

// })
// store.on("error",function(e){
// console.log("session store error",e);
// })
const secret=process.env.SECRET||"mynameisdante";
const sessionConfig = {
 
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
    store:MongoDBStore.create({mongoUrl:db_url, secret: secret ,
         touchAfter:24*60*60
    })
}



app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//----------flash and  local variables---------------------
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
   
    res.locals.admin = "628b320307fac4bd2021d0ea";
    res.locals.success = req.flash("success");
    res.locals.danger = req.flash("danger");
    res.locals.error = req.flash("error");

    next();
});


//*****************************************USER ROUTES */

app.use('/', UserRoute);


//**************************************CITY ROUTES****************************************


app.use("/city", CityRoute)






//*************************************PLACES ROUTES******************************************
app.use('/place', PlaceRoute)



//---------------------------------REVIEWS ROUTES--------------------------------------

app.use('/place/:id/review', ReviewRoute)



//--------------------------------ERROR HANDLING----------------------------------

app.all('*', (req, res, next) => {
    next(new expressError("page not found", 404))

})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something gone very wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
})
;
app.listen( 3000, () => {
    console.log(`serving on port`)
})