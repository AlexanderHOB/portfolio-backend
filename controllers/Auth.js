const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//create a new user
exports.signup = (req,res,next) => {
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();

        throw error;
    }

    //get data from body after validate fields
    const {username,email,password,phone} = req.body;

    //hash password
    bcrypt.hash(password,12)
        .then(hashedPassword => {
            const user = new User({
                username,
                email,
                password:hashedPassword,
                phone
            });

            return user.save();
        })
        .then(userCreated =>{
            res.status(201).json({
                message: 'User Created!',
                userId:userCreated._id
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

//login in platform
exports.login = (req,res,next) =>{
    //get data from req
    const {email,password} = req.body;
    let loadedUser; // save the user 
    User.findOne({email})
        .then(user=>{
            //validate if user exits
            if(!user){
                const error = new Error('A user with this email could not be found!.')
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual=>{
            //if not match password throught compare function
            if(!isEqual){
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email:loadedUser.email,
                userId:loadedUser._id.toString()
            },process.env.PRIVATEKEY,{
                expiresIn:'1h'
            });

            res.status(200).json({
                token,
                userId:loadedUser._id.toString()
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

}