const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
const multer  = require('multer'); // charge files
//routes
const projectRoutes = require('./routers/projects');
const authRoutes = require('./routers/auth');


const app = express();

//Setting dotenv to get environment variables
dotenv.config();
//body parser use json
app.use(bodyParser.json());


//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix +'.'+ file.mimetype.split('/')[1])
    }
})
//function to control which files should be uploaded and which should be skipped
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadImageProject = multer({ storage,fileFilter }).single('image');

app.use(uploadImageProject);

//Set routes 
app.use(projectRoutes);
app.use('/auth',authRoutes);

//error handle

app.use((err,req,res,next)=>{
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;

    res.status(status).json({
        message,
        data
    });
})

//start connection with database
mongoose
    .connect(process.env.DATABASE)
    .then(result=>{
        app.listen(process.env.PORT);
    })
    .catch(err=>{
        console.log(err);
    })
