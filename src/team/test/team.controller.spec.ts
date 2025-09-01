import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from '../team.controller';
import { TeamService } from '../team.service';
import { CurrentUserData } from '../../auth/decorators/current-user.decorator';

describe('TeamController', () => {
  let controller: TeamController;
  let mockTeamService: any;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Team',
        agencyId: '507f1f77bcf86cd799439012',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Team',
          agencyId: '507f1f77bcf86cd799439012',
        },
      ]),
      findOne: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Team',
        agencyId: '507f1f77bcf86cd799439012',
      }),
      update: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Updated Team',
        agencyId: '507f1f77bcf86cd799439012',
      }),
      remove: jest.fn().mockResolvedValue(undefined),
      getTeamCount: jest.fn().mockResolvedValue(5),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    mockTeamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a team', async () => {
    const createTeamDto = { name: 'Test Team' };
    const user: CurrentUserData = {
      id: '507f1f77bcf86cd799439012',
      role: 'agency',
      email: 'test@example.com',
      name: 'Test User',
      isEmailVerified: true,
    };

    const result = await controller.create(createTeamDto, user);

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Team');
    expect(mockTeamService.create).toHaveBeenCalledWith(createTeamDto, user.id);
  });

  it('should get team count', async () => {
    const user: CurrentUserData = {
      id: '507f1f77bcf86cd799439012',
      role: 'agency',
      email: 'test@example.com',
      name: 'Test User',
      isEmailVerified: true,
    };

    const result = await controller.getTeamCount(user);

    expect(result).toBeDefined();
    expect(result.count).toBe(5);
    expect(result.maxTeams).toBe(30);
    expect(mockTeamService.getTeamCount).toHaveBeenCalledWith(user.id);
  });
});
