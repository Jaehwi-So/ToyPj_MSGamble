import MemberController from '../controller/controller.member';
import MiddlewareController from '../controller/controller.middleware'
import { Router } from 'express';
import Route from './routerImpl';

class MemberRoute implements Route {
    public router  = Router();
    public url = "/member";
    constructor() {
        this.routerInit();
    }

    private routerInit = () => {
        this.router.post(`${this.url}/`, MiddlewareController.isNotLoggedIn, MemberController.create_member);  //회원가입 요청 = POST:/member (JSON/JSON)
        this.router.post(`${this.url}/login`, MiddlewareController.isNotLoggedIn, MemberController.login_member);  //로그인 요청 = POST:/member/login (JSON/JSON)
        this.router.post(`${this.url}/logout`, MiddlewareController.isLoggedIn, MemberController.logout_member);  //로그아웃 요청 = POST:/member/logout (JSON/JSON)
    }
}

export default MemberRoute;