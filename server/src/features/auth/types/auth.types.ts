import { UserType } from '../../user/types/user.type';

export interface AccessUserPayload extends Request {
    user: {
        userId: string;
        deviceId?: string;
    };
}

export interface RefreshUserPayload extends Request {
    user: {
        id: string;
        refreshToken: string;
    };
}

export interface LocalUserPayload extends Request {
    user: UserType;
}
