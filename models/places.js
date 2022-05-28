const { ref, string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
const opts = { toJSON: { virtuals: true } };
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});//image thumbnail
const PlaceSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
        ,
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Review"
        }]
    }
)
PlaceSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model("Place", PlaceSchema)