const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    projects:{
        items:[
            { 
                projectId:{
                    type: Schema.Types.ObjectId,
                    ref:'Project',
                    required:true
                },
            },
        ],
        quantity:{
            type: Number,
            required:true
        }
    }

});

module.exports = mongoose.model('User', userSchema);