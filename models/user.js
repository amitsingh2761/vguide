const { string } = require("joi");
const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        bio:String,
        facebook:String,
        twitter:String,
        instagram:String,
        profession:String,
        location:String,
        age:Array,
        avatar:String,
    }
);
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema)