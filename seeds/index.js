const mongoose = require('mongoose');
const Place = require('../models/places');
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect('mongodb://localhost:27017/Vguide', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// call unsplash and return small image

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedsDB = async () => {
    await Place.deleteMany({});
    // const P = new Place({ title: "indore", price: 3000, description: "Cleanest city", location: "MP" })
    // await P.save();

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const seed = new Place({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,


            images: [
                {
                    url: 'https://picsum.photos/200',
                    filename: 'demo',

                }],



            price: random1000 * 100,
            author: "6256ecd94bb1c5d737ab5551",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore laborum atque dolores maiores corrupti natus commodi, soluta ea dignissimos consectetur obcaecati? Eligendi harum maxime natus vel ipsam ducimus assumenda pariatur"
        })
        await seed.save();
    }
}
seedsDB()
    .then(() => {

        mongoose.connection.close();

    }
    )