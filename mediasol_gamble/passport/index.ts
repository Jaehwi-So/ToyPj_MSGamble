import passport from 'passport';
import Member from '../models/member';
import local from './local';

export default () => {
    
    passport.serializeUser<Member, number>((member , done) => {
        console.log('seriallize', member.id);
        done(null, member.id);
    });

    passport.deserializeUser<Member, number>(async (id, done) => {
        console.log('deseriallize', id);
        try {
            const member = await Member.findOne({
                where: { id },
            });
            if (!member) {
                return done(new Error('no member'));
            }
            return done(null, member);
        } 
        catch (err) {
            console.error(err);
            return done(err);
        }
    });

    local();

}