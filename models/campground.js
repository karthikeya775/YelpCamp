const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({

    title: String,
    price: Number,
    img: String,
    description: String,
    location: String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]

}) ;

campgroundSchema.post('findOneAndDelete',async(doc)=>{

      if(doc){
        await Review.deleteMany({
            _id:{

                $in : doc.reviews
            }
        })
      }
})

const Campground = mongoose.model('Campground',campgroundSchema);

module.exports = Campground;