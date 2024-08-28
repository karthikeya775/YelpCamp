const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Campground = require('./models/campground');
const Review = require('./models/review');
const AsyncErrors = require('./ErrorClass/AsyncErrors');
const ExpressErrors = require('./ErrorClass/ExpressErrors');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');


const {campgroundSchema,reviewSchema} = require('./schemas');
const campgrounds=require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/users');


mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


const sessionConfig = {

    secret : 'This is a secret',
    resave : false,
    saveUninitialized: true,

    cookie:{

        httpOnly: true,
        expires : Date.now()+(1000*60*60*24*7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

app.use((req,res,next)=>{
    
    // console.log(req.session);
    // console.log('CurrentUser', req.user);
    res.locals.currentuser = req.user;
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();
})


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', users);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res)=>{

    res.render('home');
})

app.all('*',(req,res,next)=>{
   
    next(new ExpressErrors('page not found',404));

})

app.use((err,req,res,next)=>{

    const {status=500}=err;

    if(!err.message) message = "Something Went Wrong";

    res.status(status).render('errors',{err});
})

app.listen(3000,()=>{

    console.log('Listening at port 3000');
})
