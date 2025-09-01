import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    verifyEmail: jest.fn(),
    createPasswordResetToken: jest.fn(),
    resetPassword: jest.fn(),
    updateEmailVerificationToken: jest.fn(),
    deleteById: jest.fn(),
    deleteByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
