import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/service/prisma.service';
import { mainAppSettings } from '../../src/settings/main-app-settings';

function getCookiesArray(res: request.Response): string[] {
    const raw = res.headers['set-cookie'];
    if (!raw) {
        return [];
    }
    return Array.isArray(raw) ? raw : [raw];
}

const cookiePair = (setCookie: string) => setCookie.split(';')[0];

describe('AuthController (e2e) - registration', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        useContainer(app.select(AppModule), { fallbackOnErrors: true });
        mainAppSettings(app);
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    //register
    it('should register user and return 204, and user appears in DB', async () => {
        const payload = {
            login: 'testUser',
            email: 'test@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const userInDb = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(userInDb).toBeDefined();
        expect(userInDb!.email).toBe(payload.email);
        expect(userInDb!.login).toBe(payload.login);
        expect(userInDb!.passwordHash).not.toBe(payload.password);
    });

    it('should return 400 if user with this email already exists', async () => {
        const payload = {
            login: 'testUser2',
            email: 'test2@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const res = await request(app.getHttpServer())
            .post('/auth/registration')
            .send(payload)
            .expect(400);

        expect(Array.isArray(res.body.message)).toBe(true);
        expect(res.body.message).toContainEqual({
            field: 'email',
            message: 'Email already exists. Choose another email.',
        });
    });

    //login
    it('should login user, return accessToken and set refreshToken cookie', async () => {
        const payload = {
            login: 'loginUser',
            email: 'login@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: payload.email,
                password: payload.password,
            })
            .expect(200);

        const cookies: string[] = getCookiesArray(res);
        expect(cookies.length).toBeGreaterThan(0);

        const refresh = cookies.find((c: string) => c.startsWith('refreshToken='));
        expect(refresh).toBeDefined();
        expect(refresh!).toMatch(/^refreshToken=.+;/);
        expect(refresh!).toContain('HttpOnly');
        expect(refresh!).toContain('Secure');
        expect(refresh!).toContain('SameSite=None');

        const access = cookies.find((c: string) => c.startsWith('accessToken='));
        expect(access).toBeDefined();
        expect(access!).toMatch(/^accessToken=.+;/);

        const userInDb = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(userInDb).toBeDefined();

        const tokenEntry = await prisma.refreshToken.findUnique({
            where: { userId: userInDb!.id },
        });

        expect(tokenEntry).toBeDefined();
        expect(typeof tokenEntry!.token).toBe('string');
    });

    it('should return 401 for wrong password', async () => {
        const payload = {
            login: 'wrongUser',
            email: 'wrongpass@test.com',
            password: 'correct123',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: payload.email,
                password: 'incorrect',
            })
            .expect(401);

        expect(res.body.accessToken).toBeUndefined();

        const cookies = getCookiesArray(res);

        const refreshCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
        expect(refreshCookie).toBeUndefined();
    });

    //refresh
    it('should refresh tokens and rotate refreshToken cookie', async () => {
        const payload = {
            login: 'refreshUse',
            email: 'refresh@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: payload.email, password: payload.password })
            .expect(200);

        const loginCookies = getCookiesArray(loginRes);

        const refreshSetCookie = loginCookies.find((c) => c.startsWith('refreshToken='));
        expect(refreshSetCookie).toBeDefined();

        const refreshPair = cookiePair(refreshSetCookie!);

        const userInDb = await prisma.user.findUnique({ where: { email: payload.email } });
        expect(userInDb).toBeDefined();

        const tokenBefore = await prisma.refreshToken.findUnique({
            where: { userId: userInDb!.id },
        });
        expect(tokenBefore).toBeDefined();
        const oldTokenValue = tokenBefore!.token;

        const refreshRes = await request(app.getHttpServer())
            .post('/auth/refresh-token')
            .set('Cookie', refreshPair)
            .expect(200);

        const refreshCookies = getCookiesArray(refreshRes);

        const newRefreshSetCookie = refreshCookies.find((c) => c.startsWith('refreshToken='));
        expect(newRefreshSetCookie).toBeDefined();
        expect(newRefreshSetCookie!).toMatch(/^refreshToken=.+;/);

        const newAccessSetCookie = refreshCookies.find((c) => c.startsWith('accessToken='));
        expect(newAccessSetCookie).toBeDefined();
        expect(newAccessSetCookie!).toMatch(/^accessToken=.+;/);

        const tokenAfter = await prisma.refreshToken.findUnique({
            where: { userId: userInDb!.id },
        });
        expect(tokenAfter).toBeDefined();
        expect(tokenAfter!.token).not.toBe(oldTokenValue);
    });

    it('should return 401 if refreshToken cookie is missing', async () => {
        const res = await request(app.getHttpServer()).post('/auth/refresh-token').expect(401);

        expect(res.body.message).toBe('No refresh token');
    });

    //logout
    it('should logout user, delete refreshToken from DB and clear cookie', async () => {
        const payload = {
            login: 'logoutUser',
            email: 'logout@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: payload.email, password: payload.password })
            .expect(200);

        const loginCookies = getCookiesArray(loginRes);
        const accessSetCookie = loginCookies.find((c) => c.startsWith('accessToken='));
        const refreshSetCookie = loginCookies.find((c) => c.startsWith('refreshToken='));

        expect(accessSetCookie).toBeDefined();
        expect(refreshSetCookie).toBeDefined();

        const cookieHeader = [cookiePair(accessSetCookie!), cookiePair(refreshSetCookie!)].join(
            '; ',
        );

        const userInDb = await prisma.user.findUnique({ where: { email: payload.email } });
        expect(userInDb).toBeDefined();

        const tokenBefore = await prisma.refreshToken.findUnique({
            where: { userId: userInDb!.id },
        });
        expect(tokenBefore).toBeDefined();

        const logoutRes = await request(app.getHttpServer())
            .delete('/auth/logout')
            .set('Cookie', cookieHeader)
            .expect(204);

        const tokenAfter = await prisma.refreshToken.findUnique({
            where: { userId: userInDb!.id },
        });
        expect(tokenAfter).toBeNull();

        const logoutCookies = getCookiesArray(logoutRes);
        const clearedRefresh = logoutCookies.find((c) => c.startsWith('refreshToken='));
        expect(clearedRefresh).toBeDefined();
    });

    it('should return 401 when trying to refresh with old refreshToken after logout', async () => {
        const payload = {
            login: 'logoutUse',
            email: 'logout2@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: payload.email, password: payload.password })
            .expect(200);

        const loginCookies = getCookiesArray(loginRes);
        const accessSetCookie = loginCookies.find((c) => c.startsWith('accessToken='));
        const refreshSetCookie = loginCookies.find((c) => c.startsWith('refreshToken='));
        expect(accessSetCookie).toBeDefined();
        expect(refreshSetCookie).toBeDefined();

        const cookieHeader = [cookiePair(accessSetCookie!), cookiePair(refreshSetCookie!)].join(
            '; ',
        );

        // logout
        await request(app.getHttpServer())
            .delete('/auth/logout')
            .set('Cookie', cookieHeader)
            .expect(204);

        const oldRefreshPair = cookiePair(refreshSetCookie!);

        await request(app.getHttpServer())
            .post('/auth/refresh-token')
            .set('Cookie', oldRefreshPair)
            .expect(401);
    });

    //me
    it('should return current user data for /auth/me with valid accessToken cookie', async () => {
        const payload = {
            login: 'meUser',
            email: 'me@test.com',
            password: '123456',
        };

        await request(app.getHttpServer()).post('/auth/registration').send(payload).expect(204);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: payload.email, password: payload.password })
            .expect(200);

        const loginCookies = getCookiesArray(loginRes);
        const accessSetCookie = loginCookies.find((c) => c.startsWith('accessToken='));
        expect(accessSetCookie).toBeDefined();

        const userInDb = await prisma.user.findUnique({ where: { email: payload.email } });
        expect(userInDb).toBeDefined();

        const meRes = await request(app.getHttpServer())
            .get('/auth/me')
            .set('Cookie', cookiePair(accessSetCookie!))
            .expect(200);

        expect(meRes.body).toEqual({
            id: userInDb!.id,
            email: payload.email,
            login: payload.login,
            imageUrl: userInDb!.imageUrl,
        });
    });
});
