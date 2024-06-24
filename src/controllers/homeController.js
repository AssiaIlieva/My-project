const router = require('express').Router();
const recipeService = require('../services/recipeService');


router.get('/', async (req, res) => {
    const latestRecipes = await recipeService.getLatest().lean();
    res.render('home', {latestRecipes})
});

router.get('/search', async (req, res) => {
    const {title} = req.query;
    
    let recipes = []
    if(title){
        recipes = await recipeService.search(title).lean();
    }else{
        recipes = await recipeService.getAll().lean();
    }
    res.render('search',{recipes, title})
})

module.exports = router