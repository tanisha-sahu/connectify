const user = require("../models/user.js");
const bcrypt = require('bcrypt');
const {getToken} = require("../utills/auth.js")

module.exports.signUpGet = function(req,res){
    res.render("signUp");
}

module.exports.signUpPost = async function(req,res){
    const {name, mail, password} = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    
    const User = await user.create({
        name,
        mail,
        password:hash,
        userImg:req.file.path
    })
    const token = await getToken(name,User._id);
    res.cookie("token",token,{ maxAge: 6*60*60*1000 });
    res.render("tutorial");
}

module.exports.logInGet = function(req,res){
    res.render("logIn");
}

module.exports.logInPost = async function(req,res){
    const {name,mail, password} = req.body;
    const User = await user.findOne({"name":name, "mail":mail});
    const valid = User ? bcrypt.compareSync(password, User.password) : null;
    if(valid){
        const token = await getToken(name,User._id);
        res.cookie("token",token,{ maxAge: 6*60*60*1000 });
        res.redirect("/");
    }
    else {
        res.render("logIn",{error : "Invalid user or password"});
    }
}

module.exports.logOutGet = async function(req,res){
    if(res.locals.currUser){
        res.cookie("token","",{ maxAge: 1000 });
        res.redirect("/");
    } 
    else res.redirect("/"); 
}

module.exports.changePassGet = async function(req,res){
    res.render("changePass")
}

module.exports.changePassPost = async function(req,res){
    const {newPassword, currentPassword} = req.body;
    const userid = res.locals.currUser.id;
    const User = await user.findOne({_id:userid});
    const valid = User ? bcrypt.compareSync(currentPassword, User.password) : null;

    if(valid){
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const newPass = bcrypt.hashSync(newPassword, salt);
        const User = await user.findOneAndUpdate({_id:userid}, {$set:{password:newPass}})
        res.render("changePass",{success : "Password changed"});
    }
    else {
        res.render("changePass",{error : "Invalid user or password"});
    }
}
