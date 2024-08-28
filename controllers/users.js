const User = require('../models/user');

module.exports.registerForm = (req,res)=>{

    res.render('users/register');
}

module.exports.register = async(req,res,next)=>{

    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const regUser = await User.register(user,password);

    req.login(regUser,(err)=>{

        if(err) next(err);
        req.flash('success','Welcome to Yelpcamp');
        res.redirect('/campgrounds');
    })
   
    }
    catch(e){

        req.flash('errors',e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req,res)=>{

    res.render('users/login');
}

module.exports.login = (req,res)=>{

    req.flash('success','Welcome Back!!!');
   //  console.log(req.session.returnTo);
   // console.log(req.user.username);
    const redirecturl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirecturl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}