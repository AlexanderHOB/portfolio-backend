const {validationResult} = require('express-validator');
const Skill = require('../models/Skill');
const User = require('../models/User');


exports.getSkills = (req,res,next)=>{
    //get data from params url
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    //get skill filter status to be true
    Skill.find({status:true})
        .countDocuments()
        .then(totalSkills=>{
            totalItems = totalSkills;
            return Skill.find({status:true}).sort({createdAt:-1})
                        .skip((currentPage - 1)  * perPage)
                        .limit(perPage);
        })
        .then(skills=>{
            res.status(200).json({
                message: 'Fetched Skills successfully',
                skills,
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

exports.createSkill = (req, res, next) => {
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    // get data from body
    const {name,level} = req.body;

    const skill = new Skill({
        name,
        level,
        //userId is get from isAuth Middleware
        userId: req.userId
    })
    skill.save()
        .then(skill=>{
            return User.findById(req.userId)
        })
        .then(user=>{
             //add project in array user
            user.skills.push(skill);
            return user.save();
        })
        .then(result=>{
            res.status(201).json({
                message:'Skill created successfully!',
                skill,
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
exports.getSkill = (req,res,next)=>{
    const skillId = req.params.skillId;
    Skill.findById(skillId)
        .then(skill=>{
            //validate if exists project
            if(!skill){
                const error = new Error('Could not find skill.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message:'Skill Fetched!',
                skill
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
exports.updateSkill = (req,res,next)=>{
    const skillId = req.params.skillId;
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    //get data from req
    const {name,level,status} = req.body;

    Skill.findById(skillId)
        .then(skill=>{
            if(!skill){
                const error = new Error('Skill not find!');
                error.statusCode = 422;
                throw error;
            }
            if(skill.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }
    
            if(name !== skill.name && name!=''){
                skill.name = name;
            }
            if(level !== skill.level && level!=''){
                skill.level = level;
            }
            if(status !== skill.status && status != undefined){
                skill.status = status;
            }
            return skill.save();
        })
        .then(result =>{
            res.status(200).json({
                message:'Skill Updated!',
                skill:result
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteSkill = (req, res, next) =>{
    const skillId = req.params.skillId;
    Skill.findById(skillId)
        .then(skill =>{
            if(!skill){
                const error = new Error('Could not find skill.');
                error.statusCode = 404;
                throw error;
            }
            if(skill.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }

            return Skill.findByIdAndRemove(skillId);
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
            user.skills.pull(skillId);
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message:'Deleted Skill!'
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}