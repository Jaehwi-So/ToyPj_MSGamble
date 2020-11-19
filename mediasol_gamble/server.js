
const application = require('./app');
const scheduler = require('./scheduler')

const app = application.app;
const session = application.sessionMiddleware;

const server = app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} port already`);
});

const event = scheduler;


