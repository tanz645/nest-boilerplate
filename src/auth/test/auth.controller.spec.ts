import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Types } from 'mongoose';
import { UserRole } from '../../common/constants/common.constant';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    const mockService = {
      register: jest.fn(),
      login: jest.fn(),
      verifyEmail: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const expectedResult = {
      message:
        'Registration successful. Please check your email to verify your account.',
    };

    mockAuthService.register.mockResolvedValue(expectedResult);

    const result = await controller.register(registerData);

    expect(result).toEqual(expectedResult);
    expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
  });

  it('should login a user', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const expectedResult = {
      access_token: 'jwt-token',
      user: {
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: UserRole.AGENCY,
        isEmailVerified: true,
      },
    };

    mockAuthService.login.mockResolvedValue(expectedResult);

    const result = await controller.login(loginData);

    expect(result).toEqual(expectedResult);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
  });

  it('should get user profile', () => {
    const mockUser = {
      id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      email: 'john@example.com',
      name: 'John Doe',
      role: UserRole.AGENCY,
      isEmailVerified: true,
    };

    const result = controller.getProfile(mockUser);

    expect(result).toEqual(mockUser);
  });
});
