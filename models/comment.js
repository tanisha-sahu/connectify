const mongoose = require('mongoose');

const commentScheama = new mongoose.Schema({
    comment:{
        type:String,
        require: true
    },
    creator:{
        type:String,
        require:true
    },
    creatorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

const comment = mongoose.model("comment", commentScheama);

module.exports = comment;