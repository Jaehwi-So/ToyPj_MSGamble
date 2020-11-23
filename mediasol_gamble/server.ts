import TimeScheduler from './scheduler';
import App from "./app";

/* Router list import */
import PageRouter from "./routes/router.page"
import MemberRouter from "./routes/router.member"


const application = new App(
  [
    new PageRouter(),
    new MemberRouter()
  ]
);


const server = application.app.listen(application.app.get('port'), () => {
  console.log(`${application.app.get('port')} port already`);
});

/* time event listener*/
const timeEvent = new TimeScheduler();


