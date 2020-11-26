import schedule from 'node-schedule';
import RecordController from "../controller/controller.record"

class TimeScheduler {
    constructor() {

    }
    /*
    private recordInit = schedule.scheduleJob('0 0 0 * * 1', () => {
        RecordController.init_record();
        console.log('월요일 0시 0분 0초마다 초기화');
    });
    */

    private recordInit = schedule.scheduleJob('0 0 0 * * *', () => {
        RecordController.init_record();
        console.log('매일 0시 0분 0초 마다 초기화');
    });
}

export default TimeScheduler;

