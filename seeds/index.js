const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const DBUrl = process.env.dbUrl || 'mongodb://localhost:27017/yelp-camp''

mongoose.connect(DBUrl, {
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
     console.log("Database connected!!!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
     await Campground.deleteMany({})
     for (let i = 0; i < 300; i++) {
          const random1000 = Math.floor(Math.random() * 1000);
          const price = Math.floor(Math.random() * 20) + 10;
          const camp = new Campground({
               author: 'YOUR_AUTHOR_NAME',
               location: `${cities[random1000].city}, ${cities[random1000].state}`,
               title: `${sample(descriptors)} ${sample(places)}`,
               description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam delectus quo nostrum dicta minus ipsa laboriosam explicabo fuga laudantium, voluptatibus soluta dolores eos aperiam at magni iure consequatur, voluptatem ducimus.',
               price: price,
               geometry: {
                    type: "Point",
                    coordinates: [
                         cities[random1000].longitude,
                         cities[random1000].latitude,
                    ]
               },
               images: [
                    {
                         url: 'https://res.cloudinary.com/YOUR_CLOUDINARY_NAME/image/upload/v1692968909/YelpCamp/rgwstddzsrcr4lbtynvu.jpg',
                         filename: 'YelpCamp/rgwstddzsrcr4lbtynvu',
                    },
                    {
                         url: 'https://res.cloudinary.com/YOUR_CLOUDINARY_NAME/image/upload/v1692968908/YelpCamp/ajdcuzwf660yecetprc2.jpg',
                         filename: 'YelpCamp/ajdcuzwf660yecetprc2',
                    }
               ]
          })
          await camp.save();
     }
}

seedDB().then(() => {
     mongoose.connection.close();
})
