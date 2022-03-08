const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const skillController = require('../controllers/Skill');
const isAuth = require('../middlewares/isAuth');


//get all skills
router.get('/skills',skillController.getSkills);
//route to create a new project
router.post('/skills',[
    body('name')
        .trim()
        .isLength({min:1})
        .withMessage('Please the name of the project should be at least 1 characters'),
    body('level').trim().not().isEmpty(),
],
isAuth,skillController.createSkill);
//get a skill by id
router.get('/skills/:skillId',skillController.getSkill);
//route to update a project
router.put('/skills/:skillId',[
    body('name').trim(),
    body('level').trim()
],isAuth,skillController.updateSkill);

// route to delete a project
router.delete('/skills/:skillId',isAuth,skillController.deleteSkill);

module.exports = router;