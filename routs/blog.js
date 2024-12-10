const { Router } = require("express");
const { isLoggedIn } = require("../middelware/isLoggedIn");
const { upload } = require("../middelware/multer.js");
const {
  createGet,
  createPost,
  blogs,
  view,
  editGet,
  editPost,
  deleteBlog,
  comments,
  deleteComment,
} = require("../controller/blog.js");

const router = Router();

function wrapasync(fn) { 
  return function (req, res, next) { 
      Promise.resolve(fn(req, res, next)).catch(next); 
  }; 
}

router.get("/blogs", isLoggedIn, wrapasync(blogs));

router.get("/view/:id", isLoggedIn, wrapasync(view));

router.get("/create", isLoggedIn, wrapasync(createGet));

router.post("/create", isLoggedIn, upload.single("coverImg"), wrapasync(createPost));

router.get("/edit/:id", isLoggedIn, wrapasync(editGet));

router.post("/edit/:id", isLoggedIn, wrapasync(editPost));

router.get("/delete/:id", isLoggedIn, wrapasync(deleteBlog));

router.get("/comment/delete/:blogId/:commentId", isLoggedIn, wrapasync(deleteComment));

router.post("/comment/:id", isLoggedIn, wrapasync(comments));

module.exports = router;
