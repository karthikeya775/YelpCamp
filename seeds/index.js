const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {descriptors,places} = require('./seedhelpers');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            owner: '66ccc40fa44e94ecfe4ed113',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            img:`https://picsum.photos/400?random=${Math.random()}`,
            description: 'Explore breathtaking campsites across the country with YelpCamp. Whether you are planning a family getaway, a solo adventure, or a romantic retreat, find the perfect spot to pitch your tent or park your RV. Browse user reviews, check out stunning photos, and get insider tips on amenities and local attractions',
            price : random1000+100
        })
        await camp.save();
    }
}

seedDB().then(()=>{

    mongoose.connection.close();
})


