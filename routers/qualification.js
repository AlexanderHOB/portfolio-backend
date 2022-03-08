const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const qualificationController = require('../controllers/Qualification');


//get all qualifications
router.get('/qualifications',qualificationController.getQualifications);

//route to create a new project
router.post('/qualifications',[
    body('name')
        .trim()
        .isLength({min:3})
        .withMessage('Please the name of the project should be at least 3 characters'),
    body('type').trim().not().isEmpty(),
    body('year').trim().not().isEmpty()
],
isAuth,qualificationController.createQualification);

//get a project by id
router.get('/qualifications/:qualificationId',qualificationController.getQualification);

//route to update a project
router.put('/qualifications/:qualificationId',[
    body('name')
        .trim(),
    body('type').trim(),
    body('year').trim()
],isAuth,qualificationController.updateQualification);

// route to delete a project
router.delete('/qualifications/:qualificationId',isAuth,qualificationController.deleteQualification);


module.exports = router;