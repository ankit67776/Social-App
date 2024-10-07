const { default: mongoose, Mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,

    },

    username : {
        type : String,
        required : true,
        unique : true,
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true,
    },

    profilePicture : {
        type : String,
        default : ''
    },

    location :{
        type : String,
        default : ''
    },

    dob : {
        type : Date,
        
    },

    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],

    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],

}, {timestamps : true});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;