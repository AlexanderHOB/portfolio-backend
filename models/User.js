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
        required:true
    },
    photo:{
        type:String,
        required:true
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
    },
    skills:{
        items:[
            { 
                skillId:{
                    type: Schema.Types.ObjectId,
                    ref:'Skill',
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