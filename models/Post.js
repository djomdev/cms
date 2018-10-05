const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String,
        require: true
    },

    price: {
        type: String,
        require: true
    },

    onSale: {

        type: Boolean,
        require: true

    }, 
    
    featured: {

        type: Boolean,
        require: true

    },

    outOfStock: {

        type: Boolean,
        require: true

    },
    
    allowComments: {

        type: Boolean,
        require: true

    },

    body: {
        type: String 
       },

    file: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

}, {usePushEach: true});



module.exports = mongoose.model('posts', PostSchema);