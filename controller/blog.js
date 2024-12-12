const blog = require("../models/blog");
const comments = require("../models/comment");
const user = require("../models/user.js");

module.exports.blogs = async(req,res)=>{
    const allBlog = await blog.find({}).sort({ createdAt: -1 }).populate("creatorId");
    const currentUserId = res.locals.currUser.id;
    const curUser = await user.findOne({ _id: currentUserId }).populate("following");
    res.render("home",{allBlog, curUser});
}

module.exports.view = async(req,res)=>{
    const id = req.params.id;
    const Blog = await blog.findOne({_id:id}).populate("comments");
    res.render("view",{Blog});
}  

module.exports.createGet = (req,res)=>{
    res.render("create");
}

module.exports.createPost = async (req,res)=>{
    const {title, description} = req.body;
    const Blog = await blog.create({
        title,
        description,
        image:req.file.path,
        createdAt:Date.now(),
        creator: res.locals.currUser.user,
        creatorId:res.locals.currUser.id 
    })
    res.redirect("/");
}

module.exports.deleteBlog = async (req,res)=>{
    postId = req.params.id;
    const Blog = await blog.findOne({_id:postId}).populate("comments");
    if((req.user.toString() != Blog.creatorId.toString()) && (req.user.toString() != "67599b746b3f7d1976db1ac2")){
        res.locals.error = "You are not owner of this blog";
        res.render(`view`,{Blog});  
    }  
    else{
        post = await blog.findOneAndDelete({_id:postId});
        res.redirect(`/blog/blogs/`);
    }   
}

module.exports.editGet = async(req,res)=>{
    const id = req.params.id; 
    const Blog = await blog.findOne({_id:id})
    if(Blog)
        res.render("edit",{Blog});
    else
        res.redirect("/");

}

module.exports.editPost = async (req,res)=>{
    postId = req.params.id;
    const Blog = await blog.findOne({_id:postId});
    if(req.user.toString() != Blog.creatorId.toString()){
        res.locals.error = "You are not owner of this blog";
        res.render(`view`,{Blog});  
    }
    else{
        const {title, description} = req.body;
        const Blog = await blog.findOneAndUpdate({_id:postId},
            {$set: { 
                title: title,
                description:description 
            }
        });
        res.redirect(`/blog/view/${Blog._id}`);
    }   
}

module.exports.comments = async (req,res)=>{
    const {comment} = req.body;
    postId = req.params.id;
    post = await blog.findOne({_id:postId});
    const Comment = await comments.create({
        comment,
        creator:res.locals.currUser.user,
        creatorId:res.locals.currUser.id
    })  
    post.comments.push(Comment);
    const a = await post.save();
    res.redirect(`/blog/view/${postId}`);   
}

module.exports.deleteComment = async (req,res)=>{
    blogId = req.params.blogId;
    commentId = req.params.commentId;

    const Comment = await comments.findOne({_id:commentId});
    console.log(req.user)
    console.log(Comment.creatorId)
    if(req.user.toString() != Comment.creatorId.toString()){
        res.locals.error = "You are not owner of this comment";
        res.redirect(`/blog/view/${blogId}`);  
    }
    else{
        const delObject = await blog.findByIdAndUpdate(blogId, {$pull:{comments :commentId}});
        const delComment =await comments.findByIdAndDelete(commentId); 
        res.redirect(`/blog/view/${blogId}`);   
    }
}
