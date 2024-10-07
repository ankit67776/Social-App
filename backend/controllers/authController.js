const User = require("../models/User");
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    const{name, username, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({error : 'Email is already registered'});
        }

        const existingUser1 = await User.findOne({username});
        if(existingUser1) {
            return res.status(400).json({error : 'User already exists'});
        }
        const user = new User({
            name, 
            username, 
            email, 
            password
        });

        await user.save();

        const response = {
            id : user._id,
            name : user.name,
            username : user.username,
            email : user.email
        };

        res.status(201).json(response); 
    }catch(error) {
        res.status(500).json({error : error.message});
    }
};



exports.login = async(req, res) => {
    const{username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({error : 'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({error : 'wrong password'});``
        }
        const token = Jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '5h'});

        res.cookie('token', token, {httpOnly : true}).status(200).json({token, user});

    }catch(error) {
        res.status(500).json({error : error.message});
    }
};

