import LogController from '../controller/controller.log';
import MiddlewareController from '../controller/controller.middleware'
import { Router } from 'express';
import Route from './routerImpl';

class LogRoute implements Route {
    public router  = Router();
    public url = "/log";
    constructor() {
        this.routerInit();
    }

    private routerInit = () => {
        this.router.get(`${this.url}/current`, LogController.select_log);  //현재 내기의 로그 목록 조회 = GET:/log/current (*/JSON)
        this.router.get(`${this.url}/:id`, LogController.select_detail_log);  //특정 내기의 로그 목록 조회 = GET:/log/:id (*/JSON)
    }
}

export default LogRoute;