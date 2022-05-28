const express = require("express");
const Router = express.Router({ mergeParams: true });
const catchSync = require("../errorhandler/catchAsync");
const expressError = require("../errorhandler/expressError");
const { isLoggedIn, isAdmin } = require("../authentication/authentication")

const Place = require('../models/places');
const Hotel = require('../models/hotels');

const City = require('../models/city');



//all citites

Router.get("/", async (req, res) => {
    const city = await City.find({});
    res.render("city/cities.ejs", { city })
})

//add city 
Router.get("/new", isLoggedIn,isAdmin, (req, res) => {
    res.render("city/addcity.ejs")
})
//add city part 2
Router.post('/',isLoggedIn,isAdmin, async (req, res) => {
    const city = await new City(req.body);
    city.author = req.user._id;

    await city.save();
    req.flash("success", "new city added")

    res.redirect('/city')
})

//show city
Router.get('/:id',isLoggedIn, catchSync(async (req, res) => {
    const city = await City.findById(req.params.id).populate('places').populate('hotels');
    res.render('city/showcity.ejs', { city })
}))

//add place through city
Router.get('/:id/place/new', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const city = await City.findById(id);

    res.render('city/addCplace.ejs', { city })
})
// add place through city part 2
Router.post('/:id/places', async (req, res) => {
    const { id } = req.params;
    const city = await City.findById(id);
    // const { name, price, category } = req.body;
    const place = new Place(req.body.PLACE);
    city.places.push(place);
    place.location = city.name;
    place.author = req.user._id;

    await city.save();
    await place.save();
    req.flash("success", `new location added in ${city.name}`)

    res.redirect(`/city/${id}`)
})




//add hotels through city
Router.get('/:id/hotel/new',isLoggedIn,isAdmin, async (req, res) => {
    const { id } = req.params;
    const city = await City.findById(id);

    res.render('hotels/newhotel.ejs', { city })
})
// add hotel through city part 2
Router.post('/:id/hotels', async (req, res) => {
    const { id } = req.params;
    const city = await City.findById(id);
    // const { name, price, category } = req.body;
    const hotel = new Hotel(req.body.HOTEL);
    
    city.hotels.push(hotel);
    hotel.location = city.name;

    await city.save();
    await hotel.save();
    req.flash("success", `new hotel added in ${city.name}`)


    res.redirect(`/city/${id}`)
})
// //showing hotels
// Router.get("/hotels", async (req, res) => {
//     const hotel = await Hotel.find({});
//     if (hotel) {
//         req.flash("success", `${hotel.length} hotels found`)

//         return res.render("hotels/showhotel.ejs", { hotel });
//     }
//     req.flash("danger", `no hotels found`)
//     res.redirect('/city');

// })



//deleting hotels
Router.delete("/:id",isLoggedIn,isAdmin, async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("danger", `Hotel deleted successfully`)

    res.redirect("/city");
})



//delete city
Router.delete('/:id/delete',isLoggedIn,isAdmin, async (req, res) => {
    const { id } = req.params;

    const city = await City.findByIdAndDelete(id);
    // const city = await City.findById(id);
    // const places = await city.populate("places");
    // console.log(places)

    req.flash("danger", `${city.name} city deleted`)

    res.redirect('/city');
})


module.exports = Router;
