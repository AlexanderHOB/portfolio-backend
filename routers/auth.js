const { body } = require('express-validator');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth');
const User = require('../models/User');


//route to create a new user
router.post('/signup',[
    //fields validation: email, password, username, phone
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value,{req})=>{
            return User.findOne({email:value})
                        .then(userDoc=>{
                            if(userDoc){
                                return Promise.reject('Email address already exists!')
                            }
                        });
        })
        .normalizeEmail(),
    body('password').trim().isLength({min:5}).withMessage('Please the password must be at least 5 characters'),
    body('username').trim().not().isEmpty().withMessage('Please enter a valid username'),
    body('phone').trim().isLength({min:9,max:9}).withMessage('Please the number phone should be 9 numbers'),
    
],authController.signup);

//login route
router.post('/login',authController.login);

module.exports = router;