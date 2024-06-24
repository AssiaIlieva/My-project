const { isAuth } = require('../middlewares/authMiddlware');
const recipeService = require('../services/recipeService');
const { getErrorMessage } = require('../utils/errorUtils');

const router = require('express').Router();


router.get('/create', isAuth, (req, res) => {
    res.render('recipes/create')
});


router.post('/create', isAuth, async (req, res) => {
    const recipeData = req.body;

    try {
        await recipeService.create(req.user._id, recipeData);
        res.redirect('/recipes')
    } catch (error) {
        const message = getErrorMessage(error);
        res.render("recipes/create", {...recipeData, error: message });
    }
});

router.get('/', async (req, res) => {
    const recipes = await recipeService.getAll().lean();
    res.render('recipes/catalog', {recipes});
});

router.get('/:recipeId/details', async(req, res) => {
    const recipe = await recipeService.getOneWithOwner(req.params.recipeId).lean();
    const recommendsCount = recipe.recommendList.length;
    const isOwner = recipe.owner && recipe.owner._id == req.user?._id;
    const isRecommended = recipe.recommendList.some(user => user._id == req.user?._id);
    res.render('recipes/details', {...recipe, recommendsCount, isOwner, isRecommended});
});

router.get('/:recipeId/recommend', isAuth, notRecipeOwner, notAlreadyRecommended, async (req, res) => {
    await recipeService.reccomend(req.params.recipeId, req.user._id);
    res.redirect(`/recipes/${req.params.recipeId}/details`);
});

router.get('/:recipeId/edit', isRecipeOwner, async (req, res) => {
    res.render('recipes/edit', {...req.recipe})
});

router.post('/:recipeId/edit', isRecipeOwner, async (req, res) => {
    const recipeData = req.body;
    try {
        await recipeService.edit(req.params.recipeId, recipeData);
        res.redirect(`/recipes/${req.params.recipeId}/details`)
    } catch (error) {
        res.render('recipes/edit', {...recipeData, error: getErrorMessage(error)})
    }
});


router.get('/:recipeId/delete', isRecipeOwner, async(req, res) => {
    await recipeService.delete(req.params.recipeId);
    res.redirect('/recipes')
});

async function notRecipeOwner(req, res, next) {
    const recipe = await recipeService.getOne(req.params.recipeId).lean();
    if(recipe.owner == req.user?._id) {
        return res.redirect(`/recipes`);
    }
    next();
};

async function notAlreadyRecommended(req, res, next) {
    const recipe = await recipeService.getOne(req.params.recipeId).lean();
    if(recipe.recommendList.some(id => id.equals(req.user?._id))) {
        return res.redirect(`/recipes/${req.params.recipeId}/details`);
    }
    next()
};

async function isRecipeOwner(req, res, next) {
    const recipe = await recipeService.getOne(req.params.recipeId).lean();
    if(recipe.owner != req.user?._id) {
        return res.redirect(`/recipes/${req.params.recipeId}/details`);
    }
    req.recipe = recipe
    next();
};


module.exports = router;