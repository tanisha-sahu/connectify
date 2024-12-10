const mongoose = require('mongoose');

const userScheama = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    about:{
        type:String,
        default:"Blogger"
    },
    mail:{
        type:String,
        require: true,
        unique:true
    },
    password:{
        type:String,
        require: true
    },
    userImg:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.W4S-DdCjOjUS4LqYNUieYwHaHa?w=201&h=202&c=7&r=0&o=5&dpr=1.3&pid=1.7"    
    },
    follower:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
})

const user = mongoose.model("user", userScheama);

module.exports = user;