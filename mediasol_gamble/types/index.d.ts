import Member from '../models/member';

declare global {
    namespace Express{
        export interface User extends Member {}
    }
}
