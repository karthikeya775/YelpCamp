const Campground = require('./models/campground');
const ExpressErrors = require('./ErrorClass/ExpressErrors');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

module.exports.isloggedin=((req,res,next)=>{
  
    if(!req.isAuthenticated()){
        
        req.session.returnTo = req.originalUrl;
        // console.log(req.session.returnTo);
        req.flash('errors', 'You must be signed in first!');
        return res.redirect('/login');
    }

    next();
})

module.exports.validateCampground=((req,res,next)=>{

    const {error} =campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErrors(msg,404);
    }
    else{
        next();
    }
})

module.exports.validateuser=(async(req,res,next)=>{

      const {id} = req.params;
      const campground = await Campground.findById(id);

      if(!campground.owner.equals(req.user._id)){

         req.flash('errors','You dont have permission to do this');
         return res.redirect(`/campgrounds/${id}`);
      }

      next();
})

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isreviewowner = (async(req,res,next)=>{

    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId);
    // console.log(review);

    // console.log(req.user_id);

    if(!review.owner.equals(req.user._id)){

       req.flash('errors','you dont have permission to do this');
       return res.redirect(`/campgrounds/${id}`);
    }

    next();

})