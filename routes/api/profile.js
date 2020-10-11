const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile and user models
const Profile = require('../../models/Profile')
const User = require('../../models/User')
 
//Load Validation for profile
const validateProfileInput = require('../../validations/profile');
 


// @route GET api/profile
// @description Access to current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const errors= {};
    Profile.findOne({user: req.user.id})
           .populate('user',['name','avatar'])
           .then(profile=>{
               if(!profile){
                errors.noprofile='There is no profile for this user'; 
                return res.status(404).json(errors);    
               }
               return res.json(profile);
           })
           .catch(err =>res.status(404).json(err));
});   

// @route GET api/profile/handle/(handle)
// @description Get profile by handle
// @access Public
router.get('/handle/:handle',(req,res)=>{
    const errors={};
    Profile.findOne({handle: req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile='There is no profile for this user handle';
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
})

// @route GET api/profile/user/(id)
// @description Get profile by user id
// @access Public
router.get('/user/:user_id',(req,res)=>{
    const errors={};
    Profile.findOne({user: req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile='There is no profile for this user id';
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json({noprofile:'there is no profile for this user id'}));
})
/*
// @route GET api/profile/all
// @description Get all the profile 
// @access Public

router.get('/all',(req,res)=>{
    const errors={};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofiles='There is no profiles!';
            res.status(404).json(errors);
        }
        res.json(profiles);
    })
    .catch(err=> res.status(404).json({noprofiles:'there is no profiles'}));
})
*/


// @route POST api/profile
// @description Create/Update current user's profile
// @access Private
router.post('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const {errors , isValid} = validateProfileInput(req.body);
    //Check validation
    if(!isValid){
        return(res.status(400).json(errors));
    }
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle=req.body.handle;
    if(req.body.about) profileFields.about=req.body.about;
    if(req.body.website) profileFields.website=req.body.website;
    if(req.body.status) profileFields.status=req.body.status;
    if(req.body.location) profileFields.location=req.body.location;
    profileFields.socials={};
    if(req.body.youtube) profileFields.socials.youtube=req.body.youtube;
    if(req.body.twitter) profileFields.socials.twitter=req.body.twitter;
    if(req.body.facebook) profileFields.socials.facebook=req.body.facebook;
    if(req.body.instagram) profileFields.socials.instagram=req.body.instagram;
    Profile.findOne({user: req.user.id})
            .then(profile =>{
            if(profile){
                //Update profile
                Profile.findOneAndUpdate({user: req.user.id},{$set : profileFields},{new: true})
                        .then(profile => res.json(profile));
            }
            else{
                //First entry to profile , we need to create the profile
                //Check if handle is unique
                Profile.findOne({handle: profileFields.handle})
                        .populate('user' , ['name','avatar'])
                        .then(profile =>{
                            if(profile){
                                errors.handle='handle already exists';
                                res.status(400).json(errors);
                            }
                            //Save Profile
                            new Profile(profileFields).save()
                                                      .then(profile =>res.json(profile));
                        })
            }
            });
});   
// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
  );

module.exports = router;