const {Schema, model, MongooseError} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        minLength: 10,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, 'Password is required'],
    }
});

userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 12);
});

const User = model('User', userSchema);

module.exports = User;