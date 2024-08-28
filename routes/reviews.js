const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const AsyncErrors = require('../ErrorClass/AsyncErrors');
const ExpressErrors = require('../ErrorClass/ExpressErrors');
const {reviewSchema} = require('../schemas');
const Review = require('../models/review');
const {validateReview , isloggedin,isreviewowner}=require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isloggedin, validateReview, AsyncErrors(reviews.createReview))

router.delete('/:reviewId',isloggedin, isreviewowner,AsyncErrors(reviews.deleteReview))

module.exports = router;