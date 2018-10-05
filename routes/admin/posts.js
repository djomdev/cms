const express = require('express');
const router = express.Router();
// const app = express();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
// const path = require('path');
const fs = require('fs');
const { userAuthenticated } = require('../../helpers/authentication');


router.all('/*', userAuthenticated,(req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{
    Post.find({})
        .populate('category')
        .then(posts=>{
        res.render('admin/posts', {posts: posts});
    });
});


router.get('/my-posts', (req, res)=>{
    Post.find({user: req.user.id})
        .populate('category')
        .then(posts => {
            res.render('admin/posts/my-posts', { posts: posts });
        });
});


router.get('/create', (req, res) => {
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', { categories: categories });
    });
});


router.post('/create', (req, res) => {

    let errors = [];

    if(!req.body.title) {
        errors.push({message: 'Please add a title'});
    }

    if (!req.body.body) {
        errors.push({ message: 'Please add a description' });
    }

    if(errors.length > 0){
        res.render('admin/posts/create', {
            errors: errors
        })
    } else {

        let filename = 'entrepreneurs-journal_4460x4460.jpg';

        //isEmpty function is exported from upload.helper.js
        //upload if is not empty save the file in public/uploads

        if (!isEmpty(req.files)) {
            let file = req.files.file;
            // do not redefine filename 
            // every time we move the pic the app will append it
            filename = Date.now() + '-' + file.name;

            // let dirUploads = './public/uploads';
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) throw err;
            });
        }

        let onSale = true;
        let featured = true;
        let outOfStock = true;
        let allowComments = true;

        if (req.body.onSale) {
            onSale = true;
        } else {
            onSale = false;
        }
        if (req.body.featured) {
            featured = true;
        } else {
            featured = false;
        }
        if (req.body.outOfStock) {
            outOfStock = true;
        } else {
            outOfStock = false;
        }
        if (req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }

        const newPost = new Post({

            user: req.user.id,
            title: req.body.title,
            price: req.body.price,
            onSale: onSale,
            category: req.body.category,
            featured: featured,
            outOfStock: outOfStock,
            allowComments: allowComments,
            body: req.body.body,
            file: filename
        });

        newPost.save().then(savedPost => {
            req.flash('success_message', `Post ${savedPost.title} was created successfully`);
            // console.log(savedPost);
            res.redirect('/admin/posts');
        }).catch(error => {

            // res.render('admin/posts/create', {errors: validator.errors}); 
            console.log(error, 'could not save post');
        });

    }
});

router.get('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{
            Category.find({}).then(categories => {
                res.render('admin/posts/edit', { post: post, categories: categories });
            });
    })
});

router.put('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{

            if (req.body.onSale){
                onSale = true;
            }else{
                onSale = false;
            }
            if (req.body.featured) {
                featured = true;
            } else {
                featured = false;
            }
            if (req.body.outOfStock) {
                outOfStock = true;
            } else {
                outOfStock = false;
            }
            if (req.body.allowComments){
                allowComments = true;
            }else{
                allowComments = false;
            }

            post.user = req.user.id;
            post.title = req.body.title;
            post.price = req.body.price;
            post.onSale = onSale;
            post.featured = featured;
            post.outOfStock = outOfStock;
            post.allowComments = allowComments;
            post.body = req.body.body;


            if (!isEmpty(req.files)) {
                let file = req.files.file;
                // do not redefine filename 
                // every time we move the pic the app will append it
                filename = Date.now() + '-' + file.name;
                post.file = filename;

                // let dirUploads = './public/uploads';
                file.mv('./public/uploads/' + filename, (err) => {
                    if (err) throw err;
                });
            }

            post.save().then(updatedPost=>{

                req.flash('success_message', 'Post was successfully updated');

                res.redirect('/admin/posts');
            });

            // res.render('admin/posts/edit', {post: post});
        });
    // res.send('IT WORKS')
});

router.delete('/:id', (req, res)=>{
    Post.findOneAndDelete({_id: req.params.id})
        .populate('comments')
        .then(post=>{
            fs.unlink(uploadDir + post.file, (err)=>{
                if(!post.comments.length < 1){
                    post.comments.forEach(comment => {
                        comment.remove();
                    });
                }
                post.remove().then(postRemoved=>{
                    req.flash('sucess_message', 'Post was succesfully deleted');
                    res.redirect('/admin/posts');
                });
        });
    });
});




module.exports = router;