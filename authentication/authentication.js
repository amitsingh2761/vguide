const Place = require('../models/places');
const Review = require('../models/review');
const City = require('../models/city');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.orginalUrl;
        req.flash("error", "you must me signed in First");
        return res.redirect("/login");
    }
    next();
}


//authorization middleware
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const placeupdate = await Place.findById(id)
    if (!placeupdate.author.equals(req.user._id)||!placeupdate.author.equals("628b320307fac4bd2021d0ea")) {
        req.flash("danger", "you are not autherized to update this place")
        return res.redirect(`/palce/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewid } = req.params;
    const review = await Review.findById(reviewid)
    if (!review.author.equals(req.user._id)) {
        req.flash("danger", "authentication denied")
        return res.redirect(`/palce/${id}`);
    }
    next();
}
module.exports.isAdmin = async (req, res, next) => {
  if(req.user.id!=="6290ecc89e5f0ba471f79af0");
  
  {req.flash("danger","access denied");
return res.redirect("/place/");}
  next();
}






// module.exports.isCityAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const city = await City.findById(id);

//     if (!city.author.equals(req.user._id)) {

//         req.flash("danger", "authentication denied")
//         return res.redirect(`/city/${id}`);
//     }
//     next();
// }

