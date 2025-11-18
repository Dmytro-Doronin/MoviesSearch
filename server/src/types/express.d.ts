import { UserType } from '../features/user/types/user.type';

declare global {
    namespace Express {
        interface Request {
            user: UserType;
        }
    }
}

export {};
