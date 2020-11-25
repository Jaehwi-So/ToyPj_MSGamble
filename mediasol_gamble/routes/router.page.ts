import PageController from '../controller/controller.page';
import MiddlewareController from '../controller/controller.middleware';
import { Router } from 'express';
import Route from './routerImpl';
import { Request } from 'express';

class PageRoute implements Route {
    public router  = Router();
    public url = "/";
    constructor() {
        this.routerInit();
    }

    private routerInit = () => {
        this.router.use(MiddlewareController.all_route_bind); //모든 요청 데이터 바인딩 미들웨어 = /
        this.router.get('/', PageController.go_main_page);  //메인 페이지 이동 = GET:/  (*/view)
        this.router.get('/page/login', MiddlewareController.isNotLoggedIn, PageController.go_login_page);   //로그인 페이지 이동 = GET:/page/login (*/view)
        this.router.get('/page/join', MiddlewareController.isNotLoggedIn, PageController.go_join_page); //회원가입 페이지 이동 = GET:/page/join (*/view)
        this.router.get('/page/record', MiddlewareController.isLoggedIn, PageController.go_record_page); //경기기록 페이지 이동 = GET:/page/record (*/view)
        this.router.get('/page/result', MiddlewareController.isLoggedIn, PageController.go_result_page); //명예의 전당 페이지 이동 = GET:/page/result (*/view)
        this.router.get('/page/member/point/:value', PageController.go_point_op_page); //포인트 변경 폼 이동 = GET:/page/member/point/:value (*/view)
    }
}

export default PageRoute;