import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TeamService } from '../team.service';
import { Team } from '../entities/team.entity';

describe('TeamService', () => {
  let service: TeamService;
  let mockTeamModel: any;

  beforeEach(async () => {
    const mockModel = {
      new: jest.fn().mockResolvedValue({
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Team',
          agencyId: '507f1f77bcf86cd799439012',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }),
      countDocuments: jest.fn().mockResolvedValue(0),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Team',
          agencyId: '507f1f77bcf86cd799439012',
        }),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Updated Team',
          agencyId: '507f1f77bcf86cd799439012',
        }),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Team',
          agencyId: '507f1f77bcf86cd799439012',
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getModelToken(Team.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    mockTeamModel = module.get(getModelToken(Team.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a team', async () => {
    const createTeamDto = { name: 'Test Team' };
    const agencyId = '507f1f77bcf86cd799439012'; // Valid ObjectId string

    const result = await service.create(createTeamDto, agencyId);

    expect(result).toBeDefined();
    expect(result.name).toBe('Test Team');
    expect(mockTeamModel.countDocuments).toHaveBeenCalled();
  });
});
