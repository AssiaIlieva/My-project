const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.create = async (userId, recipeData) => {
    const createdRecipe = await Recipe.create({
        owner: userId,
        ...recipeData
    });
    
    await User.findByIdAndUpdate(userId, {$push: {createdRecipes: createdRecipe._id}});
    return createdRecipe;
};

exports.getAll = () => Recipe.find();

exports.getLatest = () => Recipe.find().sort({createdAt: -1}).limit(3);

exports.getOne = (recipeId) => Recipe.findById(recipeId);

exports.getOneWithOwner = (recipeId) => this.getOne(recipeId).populate('owner');

exports.edit = (recipeId, recipeData) => Recipe.findByIdAndUpdate(recipeId, recipeData, {runValidators: true});

exports.delete = (recipeId) => Recipe.findByIdAndDelete(recipeId);

exports.reccomend = async(recipeId, userId) => {
    await Recipe.findByIdAndUpdate(recipeId, {$push: {recommendList: userId}});
    await User.findByIdAndUpdate(userId, {$push: {recommendedRecipes: recipeId}})
};

exports.search = (title) => {
    let query = {};

    if(title){
        query.title = new RegExp(title, 'i');
    }
    return Recipe.find(query);
}