import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import bcrypt from 'bcrypt';
import Member from '../models/member';
import passport from 'passport';

class MemberController implements Controller {
    constructor() {

    }
    /* 회원 가입 Insert */
    public create_member  = async (req: Request, res: Response, next: NextFunction) => {
        const { m_id, m_pwd, m_name } = req.body;
        try {
            const existMember = await Member.findOne({ where: { m_id } });
            if (existMember) {  //중복 id 존재시
                return res.json({ res: 'existID' });
            }
            const hash = await bcrypt.hash(m_pwd, 12); //비밀번호 평문 암호화
            await Member.create({   //insert
                m_id,
                m_pwd : hash,
                m_name,
            });
            return res.json({ res: 'success' });    //가입완료
        } 
        catch (error) {
            console.error(error);
            return res.json({ res: 'error' });  
        }
    };

    /* 로그인  */
    public login_member  = async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, member: Member, info: { message: string }) => {
            if (err) {    //에러 시
                console.error(err);
                return res.json({ result: `error` });
            }
            if (!member) {    //아이디, 비밀번호 에러
                return res.json({ result: `${info.message}` });
            }
            return req.login(member, (loginError: Error) => {    
                if (loginError) {
                    console.error(loginError);
                    return res.json({ result: `error` });
                }
                return res.json({ result: `success` });
            });
        })(req, res, next); 
    };

    /* 로그아웃  */
    public logout_member  = async (req: Request, res: Response, next: NextFunction) => {
   //내부 미들웨어, 해당 로그인 strategy 후에 콜백함수 실행
        try{
            console.log('logout');
            req.logout();
            req.session!.destroy(() => {
                req.session
            });
            return res.json({ result: `success` });
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };
}

export default new MemberController();