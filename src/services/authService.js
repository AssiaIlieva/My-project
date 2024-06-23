const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const {SECRET} = require('../config/config');

exports.register = async (userData) => {
    // Check if password and rePassowrd match
    if(userData.password !== userData.rePassword){
        throw new Error('Password missmatch')
    };
    // Check if the user already exists
    const user = await User.findOne({email: userData.email});
    if(user){
        throw new Error('User already exists')
    }
    const createdUser =  await User.create(userData);
    const token = await generateToken(createdUser);
    return token
} 

exports.login = async (email, password) => {
    // Get user from DB
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid email')
    }
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
        throw new Error('Invalid password')
    }
    // Generate token - check which properties are needed - names
   
    const token = await generateToken(user);
    // Return token
    return token;
};

function generateToken (user){
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    }
    return jwt.sign(payload, SECRET, {expiresIn: '2h'});
}