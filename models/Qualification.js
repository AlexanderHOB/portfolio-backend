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
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    year:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});
module.exports = mongoose.model('Qualification', qualificationSchema);