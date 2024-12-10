const {validateToken} = require('../utills/auth.js');
const user = require("../models/user.js");

async function isLoggedIn(req,res,next){
    const cookie = req.cookies["token"];
    if(cookie){
        let User = await validateToken(cookie);
        if(User && User.name){
            User = await user.findOne({_id: User.id});
            if(User) next();
        }else {
            res.locals.error = "You must be logged-in"
            res.render('logIn');
        }
    }
    else {
        res.locals.error = "You must be logged-in"
        res.render('logIn');
    }
}
module.exports = {isLoggedIn};