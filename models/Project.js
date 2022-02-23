const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})