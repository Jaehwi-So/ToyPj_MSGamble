import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';


class MiddlewareController implements Controller {
    constructor() {

    }

    /* 모든 요청에서 필요한 데이터 바인딩 */
    public all_route_bind = async (req: Request, res: Response, next: NextFunction) => {
        res.locals.member = req.user;
        next();
    };
    
    /* 로그인 여부 체크 미들웨어 */
    public isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.render('main', {warn : '로그인 후 이용하세요'});
        }
    };
    
    /* 로그아웃 여부 체크 미들웨어 */
    public isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.render('main', {warn : '로그인 상태에서 접근할 수 없는 권한입니다.'});
        }
    };
}

export default new MiddlewareController();