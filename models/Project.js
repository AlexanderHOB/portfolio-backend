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
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamp:true});
module.exports = mongoose.model('Project', projectSchema);