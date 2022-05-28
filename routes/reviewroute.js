const express = require("express");
const Router = express.Router({ mergeParams: true });
const catchSync = require("../errorhandler/catchAsync");
const expressError = require("../errorhandler/expressError");
const Place = require('../models/places');
const Review = require('../models/review');
const { isLoggedIn, isAuthor, isReviewAuthor } = require("../authentication/authentication")
//adding review
Router.post("/", isLoggedIn, async (req, res) => {
    const place = await Place.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.place=place._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success", `thanks for your feedback`)

    res.redirect(`/place/${place._id}`)
})
//deleting review
Router.delete("/:reviewid", isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewid } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("danger", `comment deleted successfully`)

    res.redirect(`/place/${id}`);
})



module.exports = Router;