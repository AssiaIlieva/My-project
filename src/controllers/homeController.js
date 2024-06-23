const router = require('express').Router();
const {isAuth} = require('../middlewares/authMiddlware');

router.get('/', (req, res) => {
    res.render('home')
});

// TODO: Delete this
router.get('/authorize-test', isAuth, (req, res) => {
    console.log(req.user);
    res.send('Your are authorized');
})

module.exports = router