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

module.exports = router;