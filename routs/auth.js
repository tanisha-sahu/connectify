const {Router} = require('express');
const {isLoggedIn} = require("../middelware/isLoggedIn")
const {upload} = require("../middelware/multer.js")
const {signUpGet, signUpPost, logInGet, logInPost, logOutGet, changePassGet, changePassPost} = require("../controller/auth.js");

const router = Router();

function wrapasync(fn) { 
    return function (req, res, next) { 
      Promise.resolve(fn(req, res, next)).catch(() => { 
        res.locals.error = "User already axist"; 
        res.render("signUp"); 
        return; 
      }); 
    }; 
  }  
 
router.get("/signUp",wrapasync(signUpGet));

router.post("/signUp",upload.single("userImg"),wrapasync(signUpPost));

router.get("/logIn",wrapasync(logInGet));

router.post("/logIn",wrapasync(logInPost));

router.get("/logOut",isLoggedIn,wrapasync(logOutGet));

router.get("/changePass",isLoggedIn,wrapasync(changePassGet));

router.post("/changePass",isLoggedIn,wrapasync(changePassPost));

module.exports = router;