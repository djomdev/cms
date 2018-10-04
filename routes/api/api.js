const { Router } = require('express');
const app = Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

// API ROUTE

// app.all('/*', (req, res, next) => {
//     req.app.locals.layout = 'api';
//     next();
// });

// app.get('/api', (req, res) => {
//     res.send('Hello World');
// });

app.get('/products', (req, res) => {
    Post.find({})
        .exec()
        .then(post => {
                res.json(
                    post
                );
        })
});

app.get('/products/:id', (req, res) => {    
    Post.findById({ _id: req.params.id })
        .exec()
        .then(post => {
            res
                .status(200)
                .json({
                    post
                });
        })
});

module.exports = app;