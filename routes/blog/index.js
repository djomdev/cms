const express = require('express');
const router = express.Router();
const Blog = require('../../models/Blog');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'blog';
    next();
});

router.get('/', (req, res)=>{
    res.render('blog/index');
});

module.exports = router;