
const { number, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const HotelSchema = new Schema(
    {
        index: Number,
        title: String,
        image: String,
        price: Number,
        description: String,
        location: String,
        contact: String,
        category:Array

    }
);

module.exports = mongoose.model("Hotel", HotelSchema)