const schedule = require('node-schedule');

const test = schedule.scheduleJob('50 * * * * *', function(){
    console.log('매 50초에 실행');
});

module.exports = schedule;

