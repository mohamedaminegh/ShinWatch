const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const isEmpty = require('../../validations/is-empty');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads');
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
// Load User Model
const User = require('../../models/User')

// Load input Validation for registry and login
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
// @route GET api/users/test 
// @description tests users route
// @access Public
router.get('/test', (req, res) => res.json({msg :"Users Work"}));   

// @route POST api/users/register
// @description register users  
// @access Public
//TODO : image not required 
router.post('/register',upload.single('avatar') , (req,res)=>{
    //Check Validation
    const {errors , isValid} = validateRegisterInput(req.body);
    if(!isValid)
    {   
        //Stop upload and throw errors
        if(!isEmpty(req.file))
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('file was deleted');
          });
        return res.status(400).json(errors);
    }


    User.findOne({email: req.body.email})
        .then(user => {
        if(user) {
            //Stop the upload and throw an error
            if(!isEmpty(req.file))
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('file was deleted');
              });
            errors.email='Email already exists';
            return res.status(400).json(errors)
        } 
        else {
          
          const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
          });
          //Add image path if user uploads an image
          if(!isEmpty(req.file)) {newUser.avatar=req.file.path};

          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if (err) throw err;
            newUser.password=hash;
            newUser.save()
               .then(user => res.json(user))
               .catch(err => console.log(err))
            })
          }) 
        }
        })
});
//@route POST /api/users/login
//@description Login user / return Token
//@access  Public
router.post('/login',(req,res) => {
const email = req.body.email;
const password = req.body.password;
//Check Validation
const {errors , isValid} = validateLoginInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
    User.findOne({email})
        .then(user =>
            {
            //Check if user with the email exists
            if (!user) {
                errors.email='No user matches this email';
                return res.status(404).json(errors);}
            //Check if password is valid 
            bcrypt.compare(password,user.password)
                    .then(isValid => {
                    if (isValid) {
                        // variable containing user data
                        const payload = {id : user.id , name: user.name ,avatar: user.avatar}
                        // Sign Token
                        jwt.sign(
                            payload,
                            keys.secret,
                            {expiresIn: 3600},
                            (err,token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                                })
                            });
                        }
                    else {
                        errors.password='Invalid password';
                        res.status(404).json(errors)}                 
                });

        });
});
//@route GET /api/users/current
//@description Return current user
//@access  Private
router.get('/current',passport.authenticate('jwt',{session: false}), (req, res)=>{
res.json({
name: req.user.name,
email: req.user.email,
avatar: req.user.avatar,
});
});

module.exports = router;
