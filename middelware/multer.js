const multer  = require('multer');
const {storage}  = require('../utills/cloudinary.js');

const upload = multer({ storage });

module.exports = {upload};