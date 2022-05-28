const express = require("express");
const Router = express.Router({ mergeParams: true });
const catchSync = require("../errorhandler/catchAsync");
const expressError = require("../errorhandler/expressError");
const { isLoggedIn, isAuthor } = require("../authentication/authentication")
const { cloudinary } = require("../cloudinary")


const Place = require('../models/places');

const City = require('../models/city');



const { storage } = require("../cloudinary")
const Multer = require("multer");
const upload = Multer({ storage })
//multer .single .array for different puposes



//locations map
Router.get("/map", (req, res) => {

    // res.send("here we go buddy be patient");
    res.render("map.ejs");
})









//homepage
Router.get("/home", (req, res) => {

    // res.send("here we go buddy be patient");
    res.render("home.ejs");
})

//searchbar








// index of place
Router.get("/", async (req, res) => {
    const place = await Place.find({});
    res.render("place.ejs", { place });

})

//adding places
Router.get("/add", isLoggedIn, async (req, res) => {
    const city = await City.find({});
    res.render("addplace.ejs", { city })
})
Router.post("/", upload.array("PLACE[images]"), async (req, res) => {
    if (req.body.Place) {
        throw (new expressError("invalid data", 404))
    } const place = new Place(req.body.PLACE);
    console.log(req.files)
    place.author = req.user._id;
    place.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const city = await City.findOne({ name: place.location });
    city.places.push(place);
    req.flash("success", `new location added successfuly`)

    await place.save();
    await city.save();

    res.redirect(`/place/${place._id}`)

});

//showing places
Router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const place = await Place.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("author");
    if (!place) {
        req.flash("error", "this location doesn't exist anymore")
        return res.redirect("/place");
    }

    res.render("show.ejs", { place });
});

//edit place

Router.get("/:id/edit", isLoggedIn, isAuthor,
    async (req, res) => {


        const { id } = req.params;
        const place = await Place.findById(id);
        const city = await City.find({});
        res.render("edit.ejs", { place, city });



    }
);

//update place
Router.put("/:id", isLoggedIn, isAuthor, upload.array("PLACE[image]"), async (req, res) => {
    const { id } = req.params;


    const place = await Place.findByIdAndUpdate(id, { ...req.body.PLACE });


    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))//to update images
    place.images.push(...img)
    await place.save();
    const city = await City.findOneAndUpdate({ name: place.location }, { ...req.body.PLACE })

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await place.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash("success", ` ${place.title} updated successfully`)
    res.redirect(`/place/${place._id}`);
    //delete place
});
Router.delete("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("danger", `location deleted successfully`)

    res.redirect("/place");
})






module.exports = Router;