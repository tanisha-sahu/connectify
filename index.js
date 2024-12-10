require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require('path')
const ejsMate = require("ejs-mate");

const auth = require("./routs/auth.js")
const blog = require("./routs/blog.js")
const profile = require("./routs/profile.js")
const {cookie} = require("./middelware/cookies.js")

const app = express();
const port = 3000; 
const dbUrl=process.env.ATLASDB_URL; 

(async function connectDB(){
    await mongoose.connect(dbUrl)
    .then(console.log("Connected to db..."));
})();

app.set("view engine", "ejs");
app.engine("ejs",ejsMate);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true})) 
app.use(express.static(path.join(__dirname,'public')));
 
app.use(cookie);

app.use("/user",auth);
app.use("/profile",profile);
app.use("/blog",blog);

app.get("/",(req,res)=>{
    res.redirect("/blog/blogs");
})

app.use((err,req,res,next)=>{
    const{status=400,message} = err;
    res.status(status); 
    res.render("error",{err});
    next(err);
});

app.get("*",(req,res)=>{
    res.render("notFound");
})
 
app.listen(port,()=>{
    console.log("Server running on http://localhost:3000/");
})