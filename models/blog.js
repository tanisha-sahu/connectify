const mongoose = require('mongoose');

const blogScheama = new mongoose.Schema({
    title:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require: true
    },
    image:{
        type: String,
    },
    creator:{
        type: String,
        required: true
    },
    creatorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
})

const blog = mongoose.model("blog", blogScheama);

module.exports = blog;