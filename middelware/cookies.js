const {validateToken} = require('../utills/auth.js');
const user = require("../models/user.js");

async function cookie(req,res,next){
    const cookie = req.cookies["token"];
    let User = await validateToken(cookie);

    if(User) User = await user.findOne({_id: User.id});
    if(User){ 
        res.locals.currUser = {"user":User.name,"id":User._id, "img":User.userImg};
        req.user = User._id;
    }
    else res.locals.currUser = null;

    res.locals.error = null;
    res.locals.success = null;
    next();
}

module.exports = {cookie}