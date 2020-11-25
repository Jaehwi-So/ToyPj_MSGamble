import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import Member from '../models/member';

export default () => {
    
  passport.use('local', new Strategy({
    usernameField: 'm_id',
    passwordField: 'm_pwd',
  }, async (m_id, m_pwd, done) => {
    try {
      const user = await Member.findOne({ where: { m_id } });
      if (!user) {
        return done(null, false, { message: 'errID' });
      }
      const result = await bcrypt.compare(m_pwd, user.m_pwd);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { message: 'errPwd' });
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }))
};