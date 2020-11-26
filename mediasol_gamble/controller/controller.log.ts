import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Controller from './controllerImpl';
import Member from '../models/member';
import Record from '../models/record';
import Log from '../models/log';
import { Op } from 'sequelize';


class LogController implements Controller {
    constructor() {

    }

    /* 현재 로그 가져오기 */
    public select_log  = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const record = await Record.findOne({   //현재 활성화된 기록
                where : {
                    is_active : true,
                },
                order: [['startDate', 'DESC']],
            });
            if(record){ //현재 활성화된 기록 존재 시
                const logs = await Log.findAll({
                    where : {
                        RecordId : record.id
                    },
                    order: [['createdAt', 'ASC']],
                }); //해당 로그 전체 read
                return res.json({ result: 'success', logs });  
            }
            //활성화된 기록 존재하지 않을 시
            return res.json({ result: 'fail'});  
        } 
        catch (error) {
            console.error(error);
            return res.json({ result: 'error' });  
        }
    };

        /* 특정 내기의 로그 가져오기 */
        public select_detail_log  = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const record = await Record.findOne({   //선택한 기준 내기 read
                    where : {
                        id : parseInt(req.params.id),
                    },
                    order: [['startDate', 'DESC']],
                });
                if(record){ //내기가 존재할 시
                    const logs = await Log.findAll({
                        where : {
                            RecordId : record.id
                        },
                        order: [['createdAt', 'ASC']],
                    }); //해당 로그 전체 read
                    return res.json({ result: 'success', logs });  
                }
                //활성화된 기록 존재하지 않을 시
                return res.json({ result: 'fail'});  
            } 
            catch (error) {
                console.error(error);
                return res.json({ result: 'error' });  
            }
        };

}

export default new LogController();