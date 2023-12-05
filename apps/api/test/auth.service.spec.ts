import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        validateUser: jest.fn().mockResolvedValue({ username: 'test' }),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('token'),
                    },
                },]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should validate user', async () => {
        expect(await service.validateUser('test', 'test')).toEqual({ username: 'test' });
        expect(await service.validateUser('test', 'wrong')).toBeNull();
    });

    it('should generate token', async () => {
        expect(await service.login({ username: 'test' })).toEqual({ access_token: 'token' });
    });
});
