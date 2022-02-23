const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');

//Setting dotenv to get environment variables
dotenv.config();

const app = express();




//start connection with database
mongoose
    .connect(process.env.DATABASE)
    .then(result=>{
        app.listen(process.env.PORT);
    })
    .catch(err=>{
        console.log(err);
    })
