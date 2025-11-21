import { Test, TestingModule } from '@nestjs/testing';

import { CustomJwtService } from '../../../common/jwt-module/service/jwt.service';
import { UserQueryRepository } from '../../user/repositories/userQuery.repository';
import { UserService } from '../../user/service/user.service';
import { UserType } from '../../user/types/user.type';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService - registration', () => {
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                    },
                },
                {
                    provide: UserQueryRepository,
                    useValue: {},
                },
                {
                    provide: CustomJwtService,
                    useValue: {},
                },
                {
                    provide: TokenService,
                    useValue: {},
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    it('should call userService.createUser() with correct payload', async () => {
        const dto = {
            login: 'testUser',
            email: 'test@example.com',
            password: '123456',
        };

        const createdUserMock = {
            id: '1',
            ...dto,
            imageUrl: null,
        };

        (userService.createUser as jest.Mock).mockResolvedValue(createdUserMock);

        const result = await authService.registration(dto);

        expect(userService.createUser).toHaveBeenCalledWith({
            login: dto.login,
            password: dto.password,
            email: dto.email,
            imageUrl: null,
        });

        expect(result).toEqual(createdUserMock);
    });
});

describe('AuthService - login', () => {
    let authService: AuthService;
    let tokenService: TokenService;
    let jwtService: CustomJwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: UserQueryRepository,
                    useValue: {},
                },
                {
                    provide: CustomJwtService,
                    useValue: {
                        createJWT: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        saveRefreshToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        tokenService = module.get<TokenService>(TokenService);
        jwtService = module.get<CustomJwtService>(CustomJwtService);
    });

    it('should create tokens and save refresh token', async () => {
        const mockUser = { id: '123', email: 'test@test.com' } as UserType;

        const fakeTokens = {
            accessToken: 'access123',
            refreshToken: 'refresh456',
        };

        (jwtService.createJWT as jest.Mock).mockResolvedValue(fakeTokens);

        const result = await authService.login(mockUser);

        expect(jwtService.createJWT).toHaveBeenCalledWith(mockUser);

        expect(tokenService.saveRefreshToken).toHaveBeenCalledWith(
            mockUser.id,
            fakeTokens.refreshToken,
        );

        expect(result).toEqual(fakeTokens);
    });
});

describe('AuthService - logout', () => {
    let authService: AuthService;
    let tokenService: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: UserQueryRepository,
                    useValue: {},
                },
                {
                    provide: CustomJwtService,
                    useValue: {},
                },
                {
                    provide: TokenService,
                    useValue: {
                        deleteRefreshToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        tokenService = module.get<TokenService>(TokenService);
    });

    it('should create remove token', async () => {
        const mockUserId: string = '123';
        await authService.logout(mockUserId);
        expect(tokenService.deleteRefreshToken).toHaveBeenCalledWith(mockUserId);
    });
});

describe('AuthService - refresh', () => {
    let authService: AuthService;
    let tokenService: TokenService;
    let jwtService: CustomJwtService;
    let userQueryRepository: UserQueryRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: UserQueryRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
                {
                    provide: CustomJwtService,
                    useValue: {
                        createJWT: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        validateRefreshToken: jest.fn(),
                        saveRefreshToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        tokenService = module.get<TokenService>(TokenService);
        jwtService = module.get<CustomJwtService>(CustomJwtService);
        userQueryRepository = module.get<UserQueryRepository>(UserQueryRepository);
    });

    it('should refresh tokens and save new refresh token', async () => {
        const userId = '123';
        const oldToken = 'old-refresh-token';

        const mockUser = {
            id: userId,
            email: 'test@test.com',
        } as UserType;

        const newTokens = {
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
        };

        (tokenService.validateRefreshToken as jest.Mock).mockResolvedValue(true);
        (userQueryRepository.findById as jest.Mock).mockResolvedValue(mockUser);
        (jwtService.createJWT as jest.Mock).mockResolvedValue(newTokens);

        const result = await authService.refresh(userId, oldToken);

        expect(tokenService.validateRefreshToken).toHaveBeenCalledWith(userId, oldToken);

        expect(userQueryRepository.findById).toHaveBeenCalledWith(userId);

        expect(jwtService.createJWT).toHaveBeenCalledWith(mockUser);

        expect(tokenService.saveRefreshToken).toHaveBeenCalledWith(userId, newTokens.refreshToken);

        expect(result).toEqual(newTokens);
    });
});

describe('AuthService - validateUser', () => {
    let authService: AuthService;
    let userQueryRepository: UserQueryRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: UserQueryRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
                {
                    provide: CustomJwtService,
                    useValue: {},
                },
                {
                    provide: TokenService,
                    useValue: {},
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userQueryRepository = module.get<UserQueryRepository>(UserQueryRepository);
    });

    it('should return user if email exists and password is correct', async () => {
        const mockUser = {
            id: '1',
            email: 'test@test.com',
            passwordSalt: 'salt',
            passwordHash: 'correctHash',
        };

        (userQueryRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

        jest.spyOn(authService, '_generateHash').mockResolvedValue('correctHash');

        const result = await authService.validateUser('test@test.com', 'password');

        expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
        (userQueryRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        const result = await authService.validateUser('unknown@test.com', 'password');

        expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
        const mockUser = {
            id: '1',
            email: 'test@test.com',
            passwordSalt: 'salt',
            passwordHash: 'correctHash',
        };

        (userQueryRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

        jest.spyOn(authService, '_generateHash').mockResolvedValue('wrongHash');

        const result = await authService.validateUser('test@test.com', 'password');

        expect(result).toBeNull();
    });
});

describe('AuthService - createJWT', () => {
    let authService: AuthService;
    let jwtService: CustomJwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {},
                },
                {
                    provide: UserQueryRepository,
                    useValue: {},
                },
                {
                    provide: CustomJwtService,
                    useValue: {
                        createJWT: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {},
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<CustomJwtService>(CustomJwtService);
    });

    it('should call jwtService.createJWT and return tokens', async () => {
        const mockUser = { id: '123', email: 'test@test.com' } as UserType;

        const fakeTokens = {
            accessToken: 'access123',
            refreshToken: 'refresh456',
        };

        (jwtService.createJWT as jest.Mock).mockResolvedValue(fakeTokens);

        const result = await authService.createJWT(mockUser);

        expect(jwtService.createJWT).toHaveBeenCalledWith(mockUser);

        expect(result).toEqual(fakeTokens);
    });
});
