import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import bcrypt from 'bcrypt';
import Member from '../models/member';
import Record from '../models/record';
import passport from 'passport';
import { Op } from 'sequelize';
import { Template } from 'nunjucks';

class RecordController implements Controller {
    constructor() {

    }
    /* 경기 시작일, 종료일 구하기 */
    public get_avaliable_date = () => {
        const now = new Date();
        const nowDayOfWeek = now.getDay();
        const nowDay = now.getDate();
        const nowMonth = now.getMonth();
        let nowYear = now.getFullYear();
        nowYear += (nowYear < 2000) ? 1900 : 0;
        const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        //const weekEndDate = new Date(nowYear, nowMonth, nowDay + (8 - nowDayOfWeek));
        //const weekEndDate = new Date(Date.now() + 20000); //use test : +20sec
        const weekEndDate = new Date(nowYear, nowMonth, nowDay + 1);   //use test : +1day
        let result = [];
        result[0] = weekStartDate;
        result[1] = weekEndDate;
        return result;
    }

    /* 점수기록 초기화 */
    public init_record  = async () => {
        try {
            while(true){
                //활성화된 기록들 중 기간이 지난 기록을 하나씩 추출
                const record = await Record.findOne({
                    where : {
                        endDate : { [Op.lt]: new Date() },
                        is_active : true,
                    },
                    include: [{
                        model: Member,
                        as: 'Members'
                    }]
                });
                //더이상 활성화된 기록이 없다면 종료
                if(!record){
                    break;
                }

                //참여 멤버들을 point를 기준으로 내림차순 정렬
                const joinMembers = await record.getMembers({
                    order: [['point', 'DESC']],
                })
                console.log(joinMembers.length);
                //참여 멤버들이 존재할 시
                if(joinMembers.length > 0){
                    const max : number = joinMembers[0].point;  //최대 point 점수
                    const duplicateMaxpointMembers = await record.getMembers({
                        where: {point : max}
                    })
                    let winnerName : string = joinMembers[0].m_name;
                    //동점자가 존재 시
                    if(duplicateMaxpointMembers.length > 0){
                        const randIdx : number = Math.floor(Math.random() * (duplicateMaxpointMembers.length));    //랜덤 인덱스 추출 0~length-1까지의 정수난수
                        console.log('randIdx', randIdx, duplicateMaxpointMembers.length);
                        winnerName = duplicateMaxpointMembers[randIdx].m_name;    //걸린사람 변경
                    }
                    //비활성화로 변경하며 걸린사람 초기화
                    record.update({
                        is_active : false,
                        winMember : winnerName
                    });
                }
                //참여 멤버들이 존재하지 않을 시
                else{
                    record.update({
                        is_active : false,
                        winMember : -1
                    });
                }
            }
            //날짜가 유효하면서 활성화된 경기가 남아있는지 탐색
            const cnt_active = await Record.count({
                where : {
                    endDate : { [Op.gte]: new Date() },
                    is_active : true,
                },
            });
            console.log(cnt_active);
            //존재하지 않을 시 새로운 경기 생성
            if(cnt_active < 1){
                const startDate = this.get_avaliable_date()[0];
                const endDate = this.get_avaliable_date()[1];
                await Record.create({
                    startDate : startDate,
                    endDate: endDate,
                    is_active: true
                });

                //멤버들의 참여와 포인트 초기화
                await Member.update({
                    is_join : false,
                    point : 0,
                },{
                   where : {is_join : true} 
                })
            }
        } 
        catch (error) {
            console.error(error);
        }
    };

    /* 현재 진행중인 내기 정보 가져오기 */
    public get_cur_record = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const record = await Record.findOne({
                where : {
                    is_active : true,
                },
                order: [['startDate', 'DESC']],
            });

            if(record){
                const members = await record.getMembers({
                    order: [['point', 'DESC']],
                })
                console.log()
                return res.json({result : 'success', record, members});
            }

            return res.json({result : 'fail'});
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };

    /* 내기 참여 요청 */
    public join_gamble  = async (req: Request, res: Response, next: NextFunction) => {
        const id : number = parseInt(req.params.id);
        try {
            const record = await Record.findOne({
                where : {
                    is_active : true,
                },
                order: [['startDate', 'DESC']],
            });
            await Member.update({
                is_join : true,
                point : 0
            },{
                where : { 
                    id,
                    is_join : false
                }
            })
            record!.addMember(id);
            return res.json({ result: 'success' });  
        } 
        catch (error) {
            console.error(error);
            return res.json({ result: 'error' });  
        }
    };

}

export default new RecordController();