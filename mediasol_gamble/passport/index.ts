import passport from 'passport';
import Member from '../models/member';
import local from './local';

export default () => {
    
    passport.serializeUser<Member, number>((user : Member , done) => {
        console.log('seriallize', user.id);
        done(null, user.id);
    });

    passport.deserializeUser<Member, number>(async (id : number, done) => {
        console.log('deseriallize', id);
        try {
            const user = await Member.findOne({
                where: { id },
            });
            if (!user) {
                return done(new Error('no member'));
            }
            return done(null, user);
        } 
        catch (err) {
            console.error(err);
            return done(err);
        }
    });

    local();

}