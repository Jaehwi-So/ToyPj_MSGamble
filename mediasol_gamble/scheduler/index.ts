import schedule from 'node-schedule';

class TimeScheduler {
    constructor() {

    }
    private test = schedule.scheduleJob('10 * * * * *', () => {
        console.log('매 10초에 실행');
    });
}

export default TimeScheduler;

