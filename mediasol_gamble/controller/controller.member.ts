import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import bcrypt from 'bcrypt';
import Member from '../models/member';
import Log from '../models/log';
import passport from 'passport';
import Record from '../models/record';

class MemberController implements Controller {
    constructor() {

    }
    /* 회원 가입 Insert */
    public create_member = async (req: Request, res: Response, next: NextFunction) => {
        const { m_id, m_pwd, m_name } = req.body;
        try {
            const existMember = await Member.findOne({ where: { m_id } });
            if (existMember) {  //중복 id 존재시
                return res.json({ res: 'existID' });
            }
            const hash : string = await bcrypt.hash(m_pwd, 12); //비밀번호 평문 암호화
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
    public login_member = async (req: Request, res: Response, next: NextFunction) => {
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
    public logout_member = async (req: Request, res: Response, next: NextFunction) => {
        try{
            req.logout();
            req.session!.destroy(() => {
                req.session;
            });
            return res.json({ result: `success` });
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };

    /* 포인트 변경 */
    public modify_point = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const targetId : number = parseInt(req.params.id);   //포인트 변경 대상 id
            const member = await Member.findOne({   //변경 대상
                where : {id : targetId}
            });
            if(member){ //변경대상 존재시
                let point : number = member.point
                const cur_record = await Record.findOne({   //현재 활성화된 기록
                    where : {is_active : true},
                    attributes: ['id']
                })
                if(cur_record && req.user){ //활성화된 기록과 로그인 세션 존재시
                    if(req.query.action == 'increase'){ //증가시키는 경우
                        point += 1;
                        await Log.create({  //로그 남기기
                            main_log : `${member.m_name}님의 포인트 +1`,
                            sub_log : `${req.user.m_name}님이 ${member.m_name}님의 포인트를 증가시켜 ${point}점이 되었습니다.`,
                            log_type : 'increase',
                            RecordId : cur_record.id,
                        });
                    }
                    if(req.query.action == 'decrease'){ //감소시키는 경우
                        point -= 1;
                        await Log.create({  //로그 남기기
                            main_log : `${member.m_name}님의 포인트 -1`,
                            sub_log : `${req.user.m_name}님이 ${member.m_name}님의 포인트를 감소시켜 ${point}점이 되었습니다.`,
                            log_type : 'decrease',
                            RecordId : cur_record.id,
                        });
                    }
                    await member.update({   //포인트 변경
                        point : point
                    });
                    return res.json({ result: `success` });
                }     
                return res.json({ result: `fail` });
            }
            return res.json({ result: `fail` });    //변경대상 존재하지 않을 시 실패
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };


}

export default new MemberController();