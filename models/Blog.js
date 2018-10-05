const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({

    // user:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    title:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('blog', BlogSchema);