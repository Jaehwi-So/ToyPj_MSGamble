import RecordController from '../controller/controller.record';
import MiddlewareController from '../controller/controller.middleware'
import { Router } from 'express';
import Route from './routerImpl';

class MemberRoute implements Route {
    public router  = Router();
    public url = "/record";
    constructor() {
        this.routerInit();
    }

    private routerInit = () => {
        this.router.get(`${this.url}`, RecordController.get_records_list);  //종료된 내기기록 목록 가져오기 = GET:/record (*/JSON)
        this.router.get(`${this.url}/current`, RecordController.get_cur_record);  //현재 활성화된 기록 가져오기 = GET:/record/current (*/JSON)
        this.router.get(`${this.url}/:id`, RecordController.get_record_detail);  //내기기록 한 개 조회 = GET:/record/:id (*/JSON)
        this.router.post(`${this.url}/attend/:id`, MiddlewareController.isLoggedIn, RecordController.join_gamble);  //현재 활성화된 내기에 참여요청 = POST:/record/attend (*/JSON)

    }
}

export default MemberRoute;