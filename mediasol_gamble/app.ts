import express from 'express';
import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import expressSession from 'express-session';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import fs from 'fs';

import Routers from './routes/routerImpl';

class App {
    public app: express.Application;
    constructor(routes: Routers[]){
        this.app = express();
        this.connectDB();   
        this.initApp();
        this.initMiddlewares(); 
        this.initRouters(routes); 
        this.initErrorHandling();   
    }

    /* 데이터베이스 연동 */
    public connectDB = () => {
        /* sequelize connect */
        const { sequelize } = require('./models');
        sequelize.sync({ force: false })
        .then(() => {
            console.log('Connect MariaDB!');
        })
        .catch((err : any) => {
            console.error('err', err);
        });
    }


    /* 디렉터리, 작업방식 등 app 설정 */
    public initApp = () => {
        /* server upload storage */
        try {
            fs.readdirSync('uploads');
        } 
        catch (error) {
            console.error('is null directory, now mkdir');
            fs.mkdirSync('uploads');
        }

        //morgan option
        if(process.env.NODE_ENV === 'production'){
            this.app.use(morgan('combined'));
        }
        else{
            this.app.use(morgan('dev'));
        }
    }

    /* 미들웨어 연결 */ 
    public initMiddlewares = () => {
        dotenv.config();
        this.app.set('port', process.env.PORT || 8001);  //port
        this.app.set('view engine', 'html'); //view engine
        nunjucks.configure('views', {   //template : nunjucks
            express: this.app,
            watch: true,
        });
        //url & json encoded
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        //static path
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use('/img', express.static(path.join(__dirname, 'uploads')));

        this.app.use(cookieParser(process.env.COOKIE_SECRET));

        //session
        const sessionOption = {
            resave: false,
            saveUninitialized: false,
            secret: process.env.COOKIE_SECRET as string,
            cookie: {
            httpOnly: true,
            secure: false,    
            },
            //store: new RedisStore({ client: redisClient}),
        }
        const sessionMiddleware = expressSession(sessionOption);
        this.app.use(sessionMiddleware);
    }

    /* 라우터 연결 */
    public initRouters = (routes: Routers[]) => {
        /* router connect */
        routes.forEach((route) => {
            this.app.use(route.router)
        })
    }

    /* 에러 핸들링 미들웨어 */
    public initErrorHandling = () => {
        /* 404 error catch */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const err : any =  new Error(`${req.method} ${req.url} 404 error.`);
            console.log(err.message);
            err.status = 404;
            next(err);
        });
        
        /* error catch middlewares */
        this.app.use((err : any, req: Request, res: Response, next: NextFunction) => {
            res.locals.message = err.message;
            res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
            res.status(err.status || 500);
            res.render('error', {err});
        });
    }
}

export default App;

