const express = require('express');
const router = express.Router();

const projectController = require('../controllers/Projects');



//route to create a new project
router.post('/projects',projectController.createProject)


module.exports = router;