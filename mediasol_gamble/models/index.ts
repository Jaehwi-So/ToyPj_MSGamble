import Member, { associate as associateMember } from './member';

export * from './sequelize';

//모델 초기화
const db = {
  Member
};

export type dbType = typeof db;


//모델 관계설정
associateMember(db);
