const mongoose = require('mongoose');
const Place = require('./places');
const Hotel = require('./hotels');
const Schema = mongoose.Schema;
const User = require("./user");

const citySchema = new Schema({
    name: {
        type: String,
        required: [true, 'city must have a name!']
    },
    image:String,
    location: {
        type: String,

    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    ,
    places: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Place'
        }
    ],
    hotels: [{
        type: Schema.Types.ObjectId,
        ref: 'Hotel'
    }]
});

// DELETE ALL ASSOCIATED PLACES AFTER A CITY IS DELETED
citySchema.post('findOneAndDelete', async function (city) {
    if (city.places.length) {
        const res = await Place.deleteMany({ _id: { $in: city.places } });
        console.log(res);
    }
    if (city.hotels.length) {
        const res = await Hotel.deleteMany({ _id: { $in: city.hotels } });
        console.log(res);
    }
})

module.exports = mongoose.model('City', citySchema);




