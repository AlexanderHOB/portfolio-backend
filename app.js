const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');

//routes
const projectRoutes = require('./routers/projects');
const authRoutes = require('./routers/auth');


const app = express();
//Setting dotenv to get environment variables
dotenv.config();
//body parser use json
app.use(bodyParser.json());
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
