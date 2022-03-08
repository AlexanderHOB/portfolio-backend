const {validationResult} = require('express-validator');
const Qualification = require('../models/Qualification');
const User = require('../models/User');


exports.getQualifications = (req,res,next)=>{
    //get data from params url
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    //get qualifications filter status to be true
    Qualification.find({status:true})
        .countDocuments()
        .then(totalQualifications=>{
            totalItems = totalQualifications;
            return Qualification.find({status:true}).sort({createdAt:-1})
                        .skip((currentPage - 1)  * perPage)
                        .limit(perPage);
        })
        .then(qualifications=>{
            res.status(200).json({
                message: 'Fetched qualifications successfully',
                qualifications,
                totalItems
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })
}

exports.createQualification = (req, res, next) => {
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    // get data from body
    const {name,type,year} = req.body;

    const qualification = new Qualification({
        name,
        type,
        year,
        //userId is get from isAuth Middleware
        userId: req.userId
    })
    qualification.save()
        .then(qualification=>{
            return User.findById(req.userId)
        })
        .then(user=>{
             //add project in array user
            user.qualifications.push(qualification);
            return user.save();
        })
        .then(result=>{
            res.status(201).json({
                message:'Qualification created successfully!',
                qualification,
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}

// get a skill by id
exports.getQualification = (req,res,next)=>{
    const qualificationId = req.params.qualificationId;
    Qualification.findById(qualificationId)
        .then(qualification=>{
            //validate if exists project
            if(!qualification){
                const error = new Error('Could not find qualification.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message:'Qualification Fetched!',
                qualification
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

//update a project
exports.updateQualification = (req, res, next)=>{
    const qualificationId = req.params.qualificationId;
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    //get data from req
    const {name,type,year,status} = req.body;


    Qualification.findById(qualificationId)
        .then(qualification=>{
            if(!qualification){
                const error = new Error('Skill not find!');
                error.statusCode = 422;
                throw error;
            }
            if(qualification.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }
    
            if(name !== qualification.name && name!=''){
                qualification.name = name;
            }
            if(type !== qualification.type && type!=''){
                qualification.type = type;
            }
            if(year !== qualification.year && year!=''){
                qualification.year = year;
            }
            if(status !== qualification.status && status != undefined){
                qualification.status = status;
            }
            return qualification.save();
        })
        .then(result =>{
            res.status(200).json({
                message:'Qualification Updated!',
                qualification:result
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteQualification = (req, res, next) =>{
    const qualificationId = req.params.qualificationId;
    Qualification.findById(qualificationId)
        .then(qualification =>{
            if(!qualification){
                const error = new Error('Could not find qualification.');
                error.statusCode = 404;
                throw error;
            }
            if(qualification.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }

            return Qualification.findByIdAndRemove(qualificationId);
        })
        .then(result =>{
            return User.findById(req.userId);
        })
        .then(user=>{
            if(!user){
                const error = new Error('User not find.!');
                error.statusCode = 404;
                throw error;
            }
            user.qualifications.pull(qualificationId);
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message:'Deleted Qualification!'
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}