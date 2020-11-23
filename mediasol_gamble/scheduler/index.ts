import schedule from 'node-schedule';

class TimeScheduler {
    constructor() {

    }
    private test = schedule.scheduleJob('0 30 17 * * *', () => {
        console.log('매 5시 30분에 실행');
    });
}

export default TimeScheduler;

