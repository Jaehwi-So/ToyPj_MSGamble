import TimeScheduler from './scheduler';
import App from "./app";

/* 라우터들 import */
import PageRouter from "./routes/router.page"
import MemberRouter from "./routes/router.member"
import RecordRouter from "./routes/router.record"
import LogRouter from "./routes/router.log"

/* 애플리케이션 초기화 */
const application = new App(
  [
    /* router init */
    new PageRouter(),
    new MemberRouter(),
    new RecordRouter(),
    new LogRouter(),
  ]
);

/* 서버 실행 */
const server = application.app.listen(application.app.get('port'), () => {
  console.log(`${application.app.get('port')} port already`);
});

/* 시간 스케줄 이벤트 등록 */
const timeEvent = new TimeScheduler();


