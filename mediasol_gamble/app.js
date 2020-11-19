const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
//const passport = require('passport');
const fs = require('fs');
const logger = require('logger');

/* router import */
const pageRouter = require('./routes/page')

/* server upload storage */
try {
    fs.readdirSync('uploads');
} 
catch (error) {
    console.error('is null directory, now mkdir');
    fs.mkdirSync('uploads');
}

/* middleware config */
dotenv.config();
const app = express();
app.set('port', process.env.PORT || 8001);  //port
app.set('view engine', 'html'); //view engine
nunjucks.configure('views', {   //template : nunjucks
    express: app,
    watch: true,
});
//json, url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//static path
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser(process.env.COOKIE_SECRET));   //cookie-parser
//session
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,    
    },
    //store: new RedisStore({ client: redisClient}),
}
const sessionMiddleware = session(sessionOption);
app.use(sessionMiddleware);
//morgan option
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
}
else{
    app.use(morgan('dev'));
}

/* sequelize connect */
const { sequelize } = require('./models');
sequelize.sync({ force: false })
.then(() => {
    console.log('Connect MariaDB!');
})
.catch((err) => {
    console.error('err', err);
});

/* passport */
/* 
fill in later 
*/ 

/* router connect */
app.use('/', pageRouter);

/* error catch middlewares */
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} router exist.`);
    logger.error(error.message);
    error.status = 404;
    next(error);
});
  
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error', {err});
});

module.exports = {
    app,
    sessionMiddleware
};

