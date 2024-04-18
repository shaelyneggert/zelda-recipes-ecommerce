// (1) require modules 
const express = require('express');
const morgan = require('morgan');
const newRoute = require('./routes/newRoute');
const userRoute = require('./routes/userRoute');
const controller = require('./controllers/newController');
const controller2 = require('./controllers/userController');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// (2) create app
const app = express();

// (3) configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');


// connect to MongoDB & connecting to the server
mongoose.connect('mongodb+srv://seggert4:Y76aQf53Uv7dWUHw@project4.s87kekg.mongodb.net/nbda-project4?retryWrites=true&w=majority&appName=Project4', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch(err => console.error(err.message));

app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://seggert4:Y76aQf53Uv7dWUHw@project4.s87kekg.mongodb.net/nbda-project4?retryWrites=true&w=majority&appName=Project4'}),
        cookie: {maxAge: 60*60*1000}
        })
);


app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

// (4) mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.json());


// (5) set up routes 
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/items', newRoute);
app.use('/users', userRoute);

// 404 error
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

// 500 interal server error 
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});


