const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Commentchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    body: {
        type: String,
        required: true
    },
    
});



module.exports = mongoose.model('comments', Commentchema);