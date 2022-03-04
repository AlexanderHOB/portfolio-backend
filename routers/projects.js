const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const projectController = require('../controllers/Projects');


//get all projects
router.get('/projects',projectController.getProjects);

//route to create a new project
router.post('/projects',[
    body('name')
        .trim()
        .isLength({min:3})
        .withMessage('Please the name of the project should be at least 3 characters'),
    body('description').trim().not().isEmpty(),
],
isAuth,projectController.createProject);

//get a project by id
router.get('/projects/:projectId',projectController.getProject);

//route to update a project
router.put('/projects/:projectId',[
    body('name')
        .trim(),
    body('description').trim()
],isAuth,projectController.updateProject);

// route to delete a project
router.delete('/projects/:projectId',isAuth,projectController.deteteProject);


module.exports = router;