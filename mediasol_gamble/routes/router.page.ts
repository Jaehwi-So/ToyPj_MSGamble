import PageController from '../controller/controller.page';
import { Router } from 'express';
import Route from './routerImpl';

class PageRoute implements Route {
    public router  = Router();
    constructor() {
        this.routerInit();
    }

    private routerInit = () => {
        this.router.use(PageController.all_request_bind);
    }
}

export default PageRoute;