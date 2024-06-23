const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 2,
        required: true,
    },
    ingredients: {
        type: String,
        minLength: 10,
        maxLength: 200,
        required: true,
    },
    instructions: {
        type: String,
        minLength: 10,
        required: true,
    },
    description: {
        type: String,
        minLength: 10,
        maxLength: 100,
        required: true,
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: true,
    },
    recommendList: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;