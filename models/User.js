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
    phone:{
        type:String,
        required:true
    },
    perfilUrl:{
        type:String,
        required:false
    },
    photo:{
        type:String,
        required:false
    },

    resetToken: String,
    resetTokenExpiration: Date,
    projects:[
            { 
                type: Schema.Types.ObjectId,
                ref:'Project',
            }],
    skills:[
        {
            type: Schema.Types.ObjectId,
            ref:'Skill',
        }
    ],
    qualifications:[
        {
            type: Schema.Types.ObjectId,
            ref:'Qualification',
        },

    ]

});

module.exports = mongoose.model('User', userSchema);