const schedule = require('node-schedule');

exports.all_request_bind  = (req, res) => {
    const j = schedule.scheduleJob('10 * * * *', function(){
        console.log('매 10초에 실행');
    });
    res.render('main', {});
};