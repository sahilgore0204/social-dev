const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Posts=require('../../models/Posts');
const {check,validationResult}=require('express-validator');
const { application } = require('express');

//api endpoint api/posts
//get all post by all users(public)
router.get('/',async (req,res)=>{
    try {
        let posts=await Posts.find().populate('user',['name','avatar']);
        return res.json(posts);
    } catch (err) {
        console.log(err.message);
        return res.json({errors:[{"message":err.message}]});
    }
})

// to add a post(private)
router.post('/',[auth,[
    check('title','please provide a title for your post').not().isEmpty(),
    check('description','please provide a description for yout post').not().isEmpty()
]],async (req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors:errors.array()});
    }
    try {
        let user=req.user.user_id;
        let {title,description}=req.body;
        let post=await Posts.create({user,title,description});
        res.send("post created successfully");
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({errors:[{"message":err.message}]});
    }
})

//get post by id(public)
router.get('/post/:post_id',async (req,res)=>{
    try {
        let post_id=req.params.post_id;
        let post=await Posts.findById(post_id);
        if(!post)
        throw Error("Post doesn't exists");
        return res.json(post);
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({errors:[{"message":err.message}]});
    }
})
//get all the posts of the users
router.get('/user/:user_id',async (req,res)=>{
    try {
        let user_id=req.params.user_id;
        let posts=await Posts.find({user:user_id});
        if(posts.length==0)
        throw Error("User doesn't has any post associated with");
        res.json({posts:posts});
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({errors:[{"message":err.message}]});
    }
});

// api to delete a post given its id(private)
router.delete('/post/:post_id',auth,async (req,res)=>{
    try {
        let post_id=req.params.post_id;
        let user_id=req.user.user_id;
        let post=await Posts.findOneAndRemove({user:user_id,_id:post_id});
        if(!post)
        throw Error("Post doesn't exists or you are not authorize to delete it");
        return res.json("post deleted succcessfully");
    } catch (err) {
        console.log(err.message);
        return res.json({errors:[{"message":err.message}]});
    }
});

// api endpoint to like/unlike a post given its id(private)
router.put('/like/:post_id',auth,async (req,res)=>{
    try {
        let id=req.params.post_id;
        let post=await Posts.findById(id);
        if(!post)
        throw Error("Post with given Id doesn't exists");
        let user=req.user.user_id;
        let ind=post.likes.indexOf(user);
        if(ind!=-1){
            //user is unliking
            post.likes.splice(ind,1);
            await post.save();
            return res.send("unliked the post");
        }
        else{
            //user is liking, add in likes, remove from dislikes if exists
            post.likes.unshift(user);
            await post.save();
            let disInd=post.dislikes.indexOf(user);
            let msg="Liked successfully";
            if(disInd!=-1){
                post.dislikes.splice(disInd,1);
                await post.save();
                msg+=" removed from disliked";
            }
            res.send(msg);
        }
    } catch (err) {
        console.log(err.message);
        return res.json({errors:[{"message":err.message}]});
    }
});

//api for dislike/undisliking the post(private)
router.put('/dislike/:post_id',auth,async (req,res)=>{
    try {
        let id=req.params.post_id;
        let post=await Posts.findById(id);
        if(!post)
        throw Error("Post with given Id doesn't exists");
        let user=req.user.user_id;
        let ind=post.dislikes.indexOf(user);
        if(ind!=-1){
            //user is undisliking
            post.dislikes.splice(ind,1);
            await post.save();
            return res.send("undisliked the post");
        }
        else{
            //user is disliking, add in dislikes, remove from likes if exists
            post.dislikes.unshift(user);
            let likInd=post.likes.indexOf(user);
            let msg="disliked successfully";
            if(likInd!=-1){
                post.likes.splice(likInd,1);
                msg+=" removed from likes";
            }
            await post.save();
            res.send(msg);
        }
    } catch (err) {
        console.log(err.message);
        return res.json({errors:[{"message":err.message}]});
    }
});

//api to add a comment to a post given id(private)
router.put('/comment/:post_id',[auth,
    check('description','Provide a description').not().isEmpty()],
    async (req,res)=>{
        let errors=validationResult(req);
        if(!errors.isEmpty())
        return res.status(401).json({errors:errors.array()});
        try {
            let id=req.params.post_id,user=req.user.user_id;
            let post =await Posts.findById(id);
            if(!post)
            throw Error("Post doesn't exists");
            let description=req.body.description;
            post.comments.unshift({user,description});
            post.save();
            res.send("comment saved successfully");
        } catch (err) {
            console.log(err.message);
            return res.status(401).json({errors:[{"message":err.message}]});
        }
    })

//api to delete a comment through comment_id(private)

router.delete('/comment/:comment_id',auth,async (req,res)=>{
    try {
        let id=req.params.comment_id,user=req.user.user_id;
        let post=await Posts.findOne({'comments._id':id});
        if(!post)
        return res.send("post doesn't exists");
        //first check if the same user has made the comment
        let ind=-1;
        let comment=post.comments.find((comment,index)=>{
            if(comment.id===id){
                ind=index;
                return true;
            }
            return false;
        });
        if(comment.user!=user){
            return res.send("you are not allowed to delete this comment");
        }
        //now you can delete the comment
        post.comments.splice(ind,1);
        post.save();
        return res.send("comment deleted successfully");
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({errors:[{"message":err.message}]});
    }
})
module.exports=router;