import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';


class MiddlewareController implements Controller {
    constructor() {

    }
    public all_route_bind = async (req: Request, res: Response, next: NextFunction) => {
        res.locals.member = req.user;
        next();
    };
    
    public isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.render('main', {warn : '로그인 후 이용하세요'});
        }
    };
    
    public isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.render('main', {warn : '로그인 상태에서 접근할 수 없는 권한입니다.'});
        }
    };
}

export default new MiddlewareController();