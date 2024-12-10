const {Router} = require('express');
const {isLoggedIn} = require("../middelware/isLoggedIn")
const {upload} = require("../middelware/multer.js")
const {profile, allProfile, follow, unfollow, removeFollower, follower, following, editGet, editPost,message,copy,premium} = require("../controller/user.js");

const router = Router();

function wrapasync(fn) { 
    return function (req, res, next) { 
        Promise.resolve(fn(req, res, next)).catch(next); 
    }; 
}


router.get("/edit/:id",isLoggedIn,wrapasync(editGet));

router.post("/edit/:id",isLoggedIn,upload.single("userImg"),wrapasync(editPost));

router.get("/view/:id",isLoggedIn, wrapasync(profile));

router.get("/all",isLoggedIn, wrapasync(allProfile));

router.get("/follow/:id",isLoggedIn, wrapasync(follow));

router.get("/unfollow/:id",isLoggedIn, wrapasync(unfollow));

router.get("/removeFollower/:id",isLoggedIn, wrapasync(removeFollower));

router.get("/follower/:id",isLoggedIn, wrapasync(follower));

router.get("/following/:id",isLoggedIn, wrapasync(following));

router.get("/message",isLoggedIn, wrapasync(message));

router.get("/copy/:id",isLoggedIn, wrapasync(copy));

router.get("/premium",isLoggedIn, wrapasync(premium));

module.exports = router;