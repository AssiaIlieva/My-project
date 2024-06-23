const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {authMiddleware} = require('../middlewares/authMiddlware');

function configExpress(app){
    app.use(express.static(path.resolve('src/static')));
    app.use(express.urlencoded({extended:false}));
    app.use(cookieParser());
    app.use(authMiddleware)


    return app
}

module.exports = configExpress;