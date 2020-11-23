import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';


class PageController implements Controller {
    constructor() {

    }
    //메인 페이지
    public go_main_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('main', {});
    };

    //로그인 페이지
    public go_login_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('member/login_form', {});
    };

    //회원가입 페이지
    public go_join_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('member/join_form', {});
    };

    //경기기록 페이지
    public go_record_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('record/record_list', {});
    };
}

export default new PageController();