const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const isEmpty = require('../../validations/is-empty');
const youtubeValidator = require('youtube-validate');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/posts');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });
// Filter only images
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


//Load Post Model
const Post = require('../../models/Post')
//Load Profile Model for the handle
const Profile = require('../../models/Profile')
//Load Comment Validation
const validateCommentInput = require('../../validations/comment');
//Load Post Validation
const validatePostInput = require('../../validations/post');
 


// @route POST api/posts
// @description Create post
// @access Private 
router.post('/',passport.authenticate('jwt',{session:false}),upload.single('content'),(req,res)=>{
    const {errors , isValid} = validatePostInput(req.body,req.file);
    
    if(!isValid )
    {   
        //Stop upload and throw errors
        if(!isEmpty(req.file))
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            });
        return res.status(400).json(errors);
    }
    const newPost=new Post({
        description:req.body.description,
        type:req.body.type,
        title: req.body.title, 
        avatar: req.user.avatar, 
        user: req.user.id
    });
    Profile.findOne({user: req.user.id})
           .then(profile=>{newPost.handle=profile.handle;
    if(newPost.type==="Image"){
    if(!isEmpty(req.file)) {newPost.content=req.file.path}
    else{errors.content='No file uploaded';
    return res.status(400).json(errors)}
    newPost.save()
            .then(post=>res.json(post))
            .catch(err => console.log(err));
    

    }
    else if(newPost.type==="Video")
    {
    newPost.content=req.body.content;
    youtubeValidator.validateUrl(newPost.content)
                    .then(response=>{newPost.save()
                          .then(post=>res.json(post))
                          .catch(err => console.log(err));
                          })
                    .catch(err=>{
                            errors.content='Invalid youtube URL';
                            return res.status(400).json(errors);
    })
    }
    })
    });

// @route GET api/posts
// @description show posts by date
// @access Public
router.get('/',(req,res)=>{
    Post.find()
        .sort({date: -1})
        .then(posts=> {res.json(posts)})
        .catch(err => res.status(404).json({message: 'no posts found'}))
});    
// @route GET api/posts/:id
// @description show posts by id
// @access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
        .then(posts=>res.json(posts))
        .catch(err=>res.status(404).json({message : 'no post with this id found'}))
})

// @route GET api/posts/user/:iduser
// @description show all the posts of a user by his id
// @access Public
router.get('/handle/:handle',(req,res)=>{
    Post.find({handle: req.params.handle})
        .sort({date: -1})
        .then(posts=>res.json(posts))
        .catch(err=>res.status(404).json({message : 'no post with this id found'}))
})

// @route DELETE api/posts/:id
// @description delete post
// @access Private
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
                //Check post owner
                if(post.user.toString()!==req.user.id){
                    return res.status(401).json({message: 'User not authorized to delete this post'})
                }
                //Delete the post
                post.remove().then(()=>res.json({success:true}));
            })
        .catch(err=>res.status(404).json({message: 'no post with this id to delete'}))
});

// @route POST api/posts/upvote/:id
// @description like post
// @access Private
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
        
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                 // get index to remove  
            const removeIndex = post.likes
            .map(comment=>comment.user.toString())
            .indexOf(req.user.id); 
            //remove from array
            post.likes.splice(removeIndex,1);
            //Save
            post.save().then(post=>res.json(post));
            }     
            else {// Add user id to likes array
            post.likes.unshift({user: req.user.id});
            post.save().then(post =>res.json(post));
            }
        })
        .catch(err=>res.status(404).json({message: 'no post with this id to like'}))
});
//TODO Change this to make different reactions on a post
router.post('/react/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={};
    Post.findById(req.params.id)
        .then(post=>{
            const result =post.reactions.filter(reaction=>reaction.user.toString()===req.user.id)
            if(result.length>0){
            // get index to remove 
            const removeIndex = post.reactions
            .map(comment=>comment.user.toString())
            .indexOf(req.user.id); 
            //Check if same reaction or not
                if (req.body.type===result[0].type){
                //remove from array
                post.reactions.splice(removeIndex,1);
                //decrement number by 1
                if (result[0].type==="stars")
                {post.nbr_reactions.stars--}
                else if (result[0].type==="sad")
                {post.nbr_reactions.sad--}
                else if (result[0].type==="love")
                {post.nbr_reactions.love--}
                else if (result[0].type==="wow")
                {post.nbr_reactions.wow--}
                else if (result[0].type==="angry")
                {post.nbr_reactions.angry--}
                else {
                    errors.reactions='no reaction of this type available';
                    return res.status(400).json(errors);
                }
                //Save
                post.save().then(post=>res.json(post));
            }

                else{
                    errors.reactions='You already reacted with '+result[0].type+', Make sure to remove it first';
                    return res.status(400).json(errors);
                }
            
            }     
            else {// Add user id to likes array
            post.reactions.unshift({user: req.user.id , type: req.body.type});
            //increment number by 1
            
            if (req.body.type==="stars")
            {post.nbr_reactions.stars++}
            else if (req.body.type==="sad")
            {post.nbr_reactions.sad++}
            else if (req.body.type==="love")
            {post.nbr_reactions.love++}
            else if (req.body.type==="wow")
            {post.nbr_reactions.wow++}
            else if (req.body.type==="angry")
            {post.nbr_reactions.angry++}
            else {
                errors.reactions='no reaction of this type available';
                return res.status(400).json(errors);
            }
            post.save().then(post =>res.json(post));
            }
        })
        .catch(err=>{console.log(err);res.status(404).json({message: 'no post with this id to react to'})})
});
/*
// @route POST api/posts/unlike/:id
// @description Unlike post
// @access Private
//TODO Change this to make different reactions on a post
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
            
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                return res.status(400).json({message: 'You have not yet liked this post'})
            }     
            // get index to remove  
            const removeIndex = post.likes
                .map(comment=>comment.user.toString())
                .indexOf(req.user.id); 
                //remove from array
                post.likes.splice(removeIndex,1);
                //Save
                post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'no post with this id is available'}))
});
*/

// @route POST api/posts/comment/:id
// @description Add comment to post
// @access Private
router.post('/comments/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors , isValid} = validateCommentInput(req.body);
    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post=>{
            const newComment = {
                text:req.body.text,       //name:req.body.name,
                avatar:req.user.avatar,   //avatar:req.body.avatar,
                user:req.user.id
            } ;
            Profile.findOne({user: req.user.id})
           .then(profile=>{newComment.handle=profile.handle;
            //Add comment to comments array
            post.comments.unshift(newComment);
            //Save
            post.save().then(post=>res.json(post));
        })
        })
        .catch(err=>res.status(404).json({message: 'No post found'}))
});

// @route DELETE api/posts/comment/:id/:comment_id
// @description Remove comment from post
// @access Private
router.delete('/comments/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    Post.findById(req.params.id)
        .then(post=>{
            //Check if comment exists
            if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
                return res.status(404).json({commentnotexists: 'Comment does not exist'});
            }
            //Get remove index
            const removeIndex = post.comments
            .map(comment => comment._id.toString())
            .indexOf(req.params.comment_id);
              //Check comment owner
              if(post.comments[removeIndex].user.toString()!==req.user.id){
                return res.status(401).json({message: 'User not authorized to delete this comment'})
            }
            //Remove comment out 
            post.comments.splice(removeIndex,1); //TODO if more than one comment is writen by a user
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'No post found'}))
});
module.exports = router;    
