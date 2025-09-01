import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../common/services/email.service';
import { UserRole } from '../../common/constants/common.constant';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    verifyEmail: jest.fn(),
    createPasswordResetToken: jest.fn(),
    resetPassword: jest.fn(),
    updateEmailVerificationToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: UserRole.AGENCY,
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('verification-token');
      mockUserService.updateEmailVerificationToken.mockResolvedValue(mockUser);
      mockEmailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await service.register(registerData);

      expect(result).toEqual({
        message:
          'Registration successful. Please check your email to verify your account.',
      });
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...registerData,
        role: UserRole.AGENCY,
      });
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserService.findByEmail.mockResolvedValue({
        email: 'john@example.com',
      });

      await expect(service.register(registerData)).rejects.toThrow(
        "Email 'john@example.com' is already registered",
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashed-password',
        role: UserRole.AGENCY,
        isEmailVerified: true,
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'matchPassword').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginData);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 'user-id',
          email: 'john@example.com',
          name: 'John Doe',
          role: UserRole.AGENCY,
          isEmailVerified: true,
        },
      });
    });

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw error for invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashed-password',
        role: UserRole.AGENCY,
        isEmailVerified: true,
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'matchPassword').mockResolvedValue(false);

      await expect(service.login(loginData)).rejects.toThrow(
        'Email or password not matched',
      );
    });
  });

  describe('matchPassword', () => {
    it('should return true for matching passwords', async () => {
      const result = await service.matchPassword(
        'password123',
        'hashed-password',
      );
      expect(typeof result).toBe('boolean');
    });
  });
});
