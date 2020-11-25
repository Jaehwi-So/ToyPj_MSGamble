import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import Member from '../models/member';
import passport from 'passport';


class PageController implements Controller {
    constructor() {

    }
    /* 메인 페이지 렌더링 */
    public go_main_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('main', {});
    };

    /* 로그인 페이지 렌더링 */
    public go_login_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('member/login_form', {});
    };

    /* 회원가입 페이지 렌더링 */
    public go_join_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('member/join_form', {});
    };

    /* 경기기록 페이지 렌더링 */
    public go_record_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('record/record_list', {});
    };

    /* 포인트 변경 페이지 렌더링 */
    public go_point_op_page = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const target_id : number = parseInt(req.params.value);  //변경 대상
            const target = await Member.findOne({ 
                where: { 
                    id : target_id,
                    is_join : true,
                }
            });
            console.log(target, req.user)
            //로그인을 하지 않은 경우
            if(!req.user){
                return res.render('record/point_modify_form', {result : 'fail', message : '로그인 후 이용하세요'});
            }
            console.log(req.user.m_name);
            //경기에 참여하지 않은 경우
            if(req.user && !req.user.is_join){
                return res.render('record/point_modify_form', {result : 'fail', message : '경기에 참여한 후 포인트 변경이 가능합니다.'});
            }
            //포인트 변경 대상이 존재하는 경우
            if(target){
                return res.render('record/point_modify_form', {result : 'success', target});
            }
            //포인트 변경 대상이 존재하지 않는 경우
            else{
                return res.render('record/point_modify_form', {result : 'fail', message : '대상이 존재하지 않습니다.'});
            }
        }   
        catch(error){
            console.error(error);
            return res.render('record/point_modify_form', {result : 'fail', message : '요청에 오류가 발생했습니다.'});
        }
    };
    /* 명예의 전당 페이지 렌더링 */
    public go_result_page  = (req: Request, res: Response, next: NextFunction) => {
        res.render('result/result_list', {});
    };
}

export default new PageController();