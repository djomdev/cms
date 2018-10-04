const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
// include a module to parse the post data from the form and we are telling our app to use it by passing in to the middleware below
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const morgan = require('morgan');
const api = require('./routes/api/api');
const port = process.env.PORT || 4500;

//global object has a library promise and we are assign it to the mongoose promise

mongoose.Promise = global.Promise;

//Create Database with mongoose

mongoose.connect(mongoDbUrl).then((db)=>{
    console.log('MONGO connected');
}).catch(error => console.log('COULD NOT CONNECT' + error));



app.use(express.static(path.join(__dirname, 'public')));

//Set View Engine

const { select, generateTime } = require('./helpers/handlebars-helpers');

app.engine('handlebars', exphbs({ defaultLayout: 'home', helpers: { select: select, generateTime: generateTime }}));
app.set('view engine', 'handlebars');

// Upload Middleware

app.use(upload());
app.use(morgan('dev'));

// Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'));

app.use(session({
    secret: 'diegodortega123',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Passport

app.use(passport.initialize());
app.use(passport.session());


// Local Variables using Middleware

app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
})

//Load Routes

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// const products = require('./routes/api/api');

const Post = require('./models/Post');
// const Category = require('./models/Category');
const products = Post;
// Use Routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);
app.use('/api/v1/', api);


app.use(express.json());

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    next();
});


app.listen(port, ()=>{

console.log(`listenting on port ${port}`);

});
