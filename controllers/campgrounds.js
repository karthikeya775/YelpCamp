const Campground = require('../models/campground');

module.exports.index =async(req,res)=>{
    
    const camps = await Campground.find({});
    res.render('campgrounds/index',{camps});

}

module.exports.renderNewForm = async(req,res)=>{

    res.render('campgrounds/new');
}

module.exports.createNewCampground = async(req,res)=>{

    const newcampground = await new Campground(req.body.campground);
    newcampground.owner = req.user._id;
    await newcampground.save();
    req.flash('success','Successfully created a new campground');

    res.redirect(`/campgrounds/${newcampground._id}`);
}

module.exports.renderEditForm = async(req,res)=>{
      
    const {id}=req.params;
    const camp = await Campground.findById(id);

    if(!camp){

       req.flash('errors','cannot find the campground');
       res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit',{camp});
}

module.exports.updateCampground = async(req,res)=>{
    
    const {id} = req.params;
    const camp= await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true});
    req.flash('success','Successfully updated a campground');
    res.redirect(`/campgrounds/${camp._id}`);
   
}

module.exports.deleteCampground = async(req,res)=>{
    
    const {id}=req.params;

    await Campground.findByIdAndDelete(id);
     
    req.flash('success','Successfully deleted a campground');
    res.redirect('/campgrounds');
}

module.exports.showCampground = async(req,res)=>{
     
    const {id} = req.params;
    const foundcampground = await Campground.findById(id).populate({

        path:'reviews',
        populate :{

            path:'owner'
        }
    }).populate('owner');

    // console.log(foundcampground);

    if(!foundcampground){
      
        req.flash('errors','cannot find the campground');
        res.redirect('/campgrounds');
        return;
    }
    res.render('campgrounds/show',{foundcampground});
}