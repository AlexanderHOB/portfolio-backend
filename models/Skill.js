const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const skillSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    level:{
        type: String,
        required: true
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
});
module.exports = mongoose.model('Skill', skillSchema);