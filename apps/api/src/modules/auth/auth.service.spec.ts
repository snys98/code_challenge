import '../../shared/extensions';
import { Cache } from 'cache-manager';

import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { mockData } from '../../../test/mocks/data.mock';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('User'),
          // useValue: jest.fn(),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({
                ...mockData.users.test,
                toObject: jest.fn().mockReturnValue({ ...mockData.users.test }),
                save: jest.fn().mockResolvedValue(true),
              })
            })
          },
        },
        UserService,
        AuthService,
        {
          provide: Cache,
          useValue: {
            get: jest.fn().mockResolvedValue(undefined),
            set: jest.fn().mockResolvedValue("OK"),
            del: jest.fn().mockResolvedValue("OK"),
          } as Partial<Cache>
        },
        {
          provide: JwtService,
          useValue: {
            // sign: jest.fn().mockReturnValue('token'),
            signAsync: jest.fn().mockReturnValue('token'),
          } as Partial<JwtService>,
        },
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    expect(await service.validateUser('test', 'test')).toMatchObject({ id: "id", username: 'test', locked: false });
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('locked user should fail when validate', async () => {
    const userModelMock = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockData.users.test,
          locked: true,
          toObject: jest.fn().mockReturnValue({ ...mockData.users.test, locked: true }),
          save: jest.fn().mockResolvedValue(true),
        })
      })
    };
    (service as Editable<AuthService>)["userModel"] = userModelMock as any;
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(/User account is locked./);
  });

  it('should lock user after max failed login attempts', async () => {
    let failedAttempts = undefined;
    const cacheMock = {
      get: jest.fn().mockImplementation((key, value) => failedAttempts),
      set: jest.fn().mockImplementation((key, value) => failedAttempts = value),
      del: jest.fn().mockImplementation((key, value) => failedAttempts = undefined),
    };
    (service as Editable<AuthService>)["cache"] = cacheMock as any;
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(UnauthorizedException);
    expect(failedAttempts).toBe(1);
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(UnauthorizedException);
    expect(failedAttempts).toBe(2);
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(UnauthorizedException);
    expect(failedAttempts).toBe(3);
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(UnauthorizedException);
    expect(failedAttempts).toBe(3);
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(/User account is locked./);
    expect(failedAttempts).toBe(3);
    await expect(service.validateUser('test', 'wrong')).rejects.toThrow(/User account is locked./);
  });

  it('should generate token', async () => {
    expect(await service.signIn({ id: "id", username: 'test', password: "test" })).toMatchObject({ id: "id", access_token: 'token' });
  });
});
