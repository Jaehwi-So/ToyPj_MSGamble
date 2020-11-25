import Member, { associate as associateMember } from './member';
import Record, { associate as associateRecord } from './record';
import Log, { associate as associateLog } from './log';

export * from './sequelize';

//모델 초기화
const db = {
  Member,
  Record,
  Log,
};

export type dbType = typeof db;


//모델 관계설정
associateMember(db);
associateRecord(db);
associateLog(db);
