import { config } from 'dotenv';
import process from 'process';

config();
export const jwtConstants = {
    secret: process.env.JWT_SECRET || '123',
};
