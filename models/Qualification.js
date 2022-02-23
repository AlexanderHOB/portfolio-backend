const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const qualificationSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type: String,
        required: true
    },
    year:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('Qualification', qualificationSchema);