import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';


class PageController implements Controller {
    constructor() {

    }
    public all_request_bind  = (req: Request, res: Response, next: NextFunction) => {
        res.render('main', {});
    };

}

export default new PageController();