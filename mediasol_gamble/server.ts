import TimeScheduler from './scheduler';
import App from "./app";

/* Router list import */
import PageRouter from "./routes/router.page"


const application = new App(
  [
    new PageRouter()
  ]
);


const server = application.app.listen(application.app.get('port'), () => {
  console.log(`${application.app.get('port')} port already`);
});

/* time event listener*/
const timeEvent = new TimeScheduler();


