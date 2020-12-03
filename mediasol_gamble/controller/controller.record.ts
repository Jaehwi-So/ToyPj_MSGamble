import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import Member from '../models/member';
import Record from '../models/record';
import Pager from '../util/pager';
import Log from '../models/log';
import { Op } from 'sequelize';


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
        const weekEndDate = new Date(nowYear, nowMonth, nowDay + (8 - nowDayOfWeek));
        //const weekEndDate = new Date(Date.now() + (1000 * 60 * 10)); //use test : +10min
        //const weekEndDate = new Date(nowYear, nowMonth, nowDay + 1);   //use test : +1day
        let result = [];
        result[0] = weekStartDate;
        result[1] = weekEndDate;
        return result;
    }

    /* 점수기록 초기화 */
    public init_record  = async () => {
        try {
            while(true){
                //활성화된 기록들 중 기간이 지난 기록을 비활성화 하기 위해서 하나씩 추출
                const record = await Record.findOne({
                    where : {
                        endDate : { [Op.lte]: new Date() },
                        is_active : true,
                    },
                    include: [{
                        model: Member,
                        as: 'Members'
                    }]
                });
                //더이상 비활성화 시킬 기록이 없다면 종료
                if(!record){
                    break;
                }

                //참여 멤버들을 point를 기준으로 내림차순 정렬
                const joinMembers = await record.getMembers({
                    order: [['point', 'DESC']],
                })
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
                        winMember : 'no'
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
            //현재 활성화된 기록
            const record = await Record.findOne({
                where : {
                    is_active : true,
                },
                order: [['startDate', 'DESC']],
            });
            //현재 활성화된 기록 존재 시
            if(record){ 
                const members = await record.getMembers({
                    order: [['point', 'DESC']],
                }); //현재 기록에 associate된 멤버들 목록 read
                return res.json({result : 'success', record, members});
            }
            //활성화된 기록이 존재하지 않을 시
            else{   
                return res.json({result : 'fail'});
            }
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };

    /* 내기 참여 요청 */
    public join_gamble  = async (req: Request, res: Response, next: NextFunction) => {
        const id : number = parseInt(req.params.id);
        try {
            // 요청 대상 id와 세션 id가 일치하지 않는 경우
            if(!req.user || id != req.user.id){
                return res.json({ result: 'fail' });  
            }
            // 세션 id와 일치하는 경우
            const record = await Record.findOne({
                where : {
                    is_active : true,
                },
                order: [['startDate', 'DESC']],
            }); //현재 활성화된 기록
            const member = await Member.findOne({
                where : { 
                    id,
                    is_join : false
                }
            }); //join 상태가 아닌 참여 대상 멤버

            //활성화된 기록과 대상 멤버가 둘 다 존재하는 경우
            if(member && record){
                //멤버의 참여여부 변경
                await member.update({
                    is_join : true,
                    point : 0
                });
                //로그 남기기
                await Log.create({
                    main_log : '새로운 멤버가 이번주 내기에 입장하였습니다.',
                    sub_log : `${member.m_name}님이 참가합니다.`,
                    log_type : 'join',
                    RecordId : record.id,
                });

                //기록 테이블에 외래키로 추가
                record!.addMember(id);
                return res.json({ result: 'success' });  
            }
            return res.json({ result: 'fail' });  
        } 
        catch (error) {
            console.error(error);
            return res.json({ result: 'error' });  
        }
    };

    /* 내기 전체내용 페이징 처리하여 가져오기 */
    public get_records_list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let records, rowTotal;
            const url = `/record`; //요청 쿼리 url
            const curPage = Number(req.query.page) || 1; // 현재 페이지 번호 , 기본값은 1
            const contentSize = 10; // 페이지에서 보여줄 컨텐츠 수.
            const pageSize = 5; // 페이지네이션 개수 설정.
            const skipSize = (curPage - 1) * contentSize; //다음 페이지 갈 때 건너뛸 리스트 개수.
            records = await Record.count({
                where : {is_active : false},
            } );
            rowTotal = records;
            records = await Record.findAll({     
                where : {is_active : false}, 
                order: [['endDate', 'DESC']],
                limit: contentSize,
                offset: skipSize, 
            });
            if(records.length > 0){
                //url, 쿼리 유무, 현재 페이지, 페이지 컨텐츠 수, 한 화면 페이지네이션 개수, 생략 컨텐츠 수, 총 로우 개수, ajax여부, ajax함수
                const pager = Pager.getPage(url, false, curPage, contentSize, pageSize, skipSize, rowTotal, true, 'get_record_list');
                return res.json({ result: 'success', records: records, pager: pager });
            }
            else{
                return res.json({ result: 'no'});
            }
        }
        catch(error){
            console.error(error);
            return res.json({ result: 'no'});
        }
    }

    /* 특정 내기 정보 가져오기 */
    public get_record_detail = async (req: Request, res: Response, next: NextFunction) => {
        try{
            //현재 활성화된 기록
            const record = await Record.findOne({
                where : {
                    id : parseInt(req.params.id),
                }
            });
            //현재 활성화된 기록 존재 시
            if(record){ 
                const members = await record.getMembers({
                    order: [['updatedAt', 'DESC']],
                }); //현재 기록에 associate된 멤버들 목록 read
                return res.json({result : 'success', record, members});
            }
            //활성화된 기록이 존재하지 않을 시
            else{   
                return res.json({result : 'fail'});
            }
        }
        catch(err){
            return res.json({ result: `fail` });
        }
    };
}

export default new RecordController();