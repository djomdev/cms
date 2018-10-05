const express = require('express');
const router = express.Router();
// const Blog = require('../../models/Blog');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'blog';
    next();
});

// route - /blog/post

router.get('/', (req, res)=>{
    res.send('IT WORKS');
});

router.get('/create', (req, res) => {
    res.render('blog/posts/create');
});

router.post('/create', (req, res) => {
    res.send('WORKED');
});

module.exports = router;