const {validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const User = require('../models/User');

//get all project filter by author
exports.getProjects = (req,res,next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;

    Project.find({status:true}).countDocuments()
        .then(count=>{
            totalItems = count;
            return Project.find({status:true}).sort({createAt:-1})
                .skip((currentPage - 1)  * perPage)
                .limit(perPage);
        })
        .then(projects =>{
            res.status(200).json({
                message: 'Fetched projects successfully',
                projects,
                totalItems
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        });
}
//create a project
exports.createProject = (req,res,next) => {
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    //validate if req have a image file
    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    //replace to save image
    const imageUrl = req.file.path.replace("\\" ,"/");
    //get data from request
    const {name,description,status} = req.body;

    //create a objet project
    const project = new Project({
        name, 
        description, 
        imageUrl, 
        status,
        //userId is get from isAuth Middleware
        userId: req.userId
    });
    project.save()
        .then(project=>{
            //create project in user
            return User.findById(req.userId)
        })
        .then(user=>{
            //add project in array user
            user.projects.push(project);
            return user.save();
            
        })
        .then(result=>{
            res.status(201).json({
                message:'Project created successfully!',
                project,
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}
// get a project by id
exports.getProject = (req,res,next)=>{
    const projectId = req.params.projectId;
    Project.findById(projectId)
        .then(project=>{
            //validate if exists project
            if(!project){
                const error = new Error('Could not find project.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message:'Project Fetched!',
                project
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
exports.updateProject = (req,res,next)=>{
    const projectId = req.params.projectId;
    const errors = validationResult(req);
    //validate fields and return errors before to save data
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    //get data from req
    const {name,description,status} = req.body;
    let imageUrl='';

    if(req.file){
        //replace to save image
        imageUrl = req.file.path.replace("\\" ,"/");
    }
    Project.findById(projectId)
        .then(project=>{
            if(!project){
                const error = new Error('Project not find!');
                error.statusCode = 422;
                throw error;
            }
            if(project.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }
            if(imageUrl !== project.imageUrl && imageUrl !=''){
                clearImage(project.imageUrl); // delete image
                project.imageUrl = imageUrl;
            }
            if(name !== project.name && name!=''){
                project.name = name;
            }
            if(description !== project.description && description!=''){
                project.description = description;
            }
            if(status !== project.status && status != undefined){
                project.status = status;
            }
            return project.save();
        })
        .then(result =>{
            res.status(200).json({
                message:'Project Updated!',
                project:result
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deteteProject = (req, res, next) =>{
    const projectId = req.params.projectId;
    Project.findById(projectId)
        .then(project =>{
            if(!project){
                const error = new Error('Could not find Project.');
                error.statusCode = 404;
                throw error;
            }
            if(project.userId.toString() !== req.userId){
                const error = new Error('Not authorized!');
                error.statusCode = 422;
                throw error;
            }
            //delete image
            clearImage(project.imageUrl);

            return Project.findByIdAndRemove(projectId);
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
            user.projects.pull(projectId);
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message:'Deleted post!'
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

/**
 * Function to delete image when project is deleting or update
 * @param {string} filePath Path of image file
 */
const clearImage = filePath =>{
    //create path 
    filePath = path.join(__dirname,'..',filePath);
    //delete image
    fs.unlink(filePath, error => console.log(error));
}