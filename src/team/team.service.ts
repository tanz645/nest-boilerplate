import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, TeamDocument } from './entities/team.entity';
import { MAX_TEAMS_PER_AGENCY } from '../common/constants/common.constant';
import { TeamLimitExceededException } from './exceptions/team-limit-exceeded.exception';
import {
  PaginationDto,
  PaginationResponse,
} from '../common/dto/pagination.dto';
import { TeamResponse } from './types/team.types';
import { TeamTransformer } from './transformers/team.transformer';
import { PaginationTransformer } from '../common/transformers/pagination.transformer';

@Injectable()
export class TeamService {
  // Team fields for projection - easy to maintain and modify
  private readonly TEAM_FIELDS = [
    'name',
    'agencyId',
    'createdAt',
    'updatedAt',
  ] as const;

  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async create(
    createTeamDto: CreateTeamDto,
    agencyId: Types.ObjectId,
  ): Promise<Team> {
    // Check if agency has reached the maximum number of teams
    const teamCount = await this.teamModel.countDocuments({
      agencyId,
    });

    if (teamCount >= MAX_TEAMS_PER_AGENCY) {
      throw new TeamLimitExceededException(MAX_TEAMS_PER_AGENCY);
    }

    const team = new this.teamModel({
      ...createTeamDto,
      agencyId,
    });

    return team.save();
  }

  async findAll(agencyId: Types.ObjectId): Promise<TeamResponse[]> {
    const teams = await this.teamModel
      .find({ agencyId })
      .select(this.TEAM_FIELDS.join(' '))
      .lean()
      .exec();

    return TeamTransformer.toResponseArray(teams);
  }

  async findAllPaginated(
    agencyId: Types.ObjectId,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<TeamResponse>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      this.teamModel
        .find({ agencyId: agencyId })
        .select(this.TEAM_FIELDS.join(' '))
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.teamModel.countDocuments({ agencyId }),
    ]);

    return PaginationTransformer.toPaginatedResponse(
      TeamTransformer.toResponseArray(teams),
      paginationDto,
      total,
    );
  }

  async findOne(
    id: Types.ObjectId,
    agencyId: Types.ObjectId,
  ): Promise<TeamResponse> {
    const team = await this.teamModel
      .findOne({
        _id: id,
        agencyId,
      })
      .select(this.TEAM_FIELDS.join(' '))
      .lean()
      .exec();

    if (!team) {
      throw new NotFoundException(`Team with ID ${id.toString()} not found`);
    }

    return TeamTransformer.toResponse(team);
  }

  async update(
    id: Types.ObjectId,
    updateTeamDto: UpdateTeamDto,
    agencyId: Types.ObjectId,
  ): Promise<TeamResponse> {
    // Build filter to include agencyId check in the query
    const filter: any = { _id: id };
    if (agencyId) {
      filter.agencyId = agencyId;
    }

    const updatedTeam = await this.teamModel
      .findOneAndUpdate(filter, updateTeamDto, {
        new: true,
        runValidators: true,
      })
      .select(this.TEAM_FIELDS.join(' '))
      .lean()
      .exec();

    if (!updatedTeam) {
      throw new NotFoundException(`Team with ID ${id.toString()} not found`);
    }

    return TeamTransformer.toResponse(updatedTeam);
  }

  async remove(id: Types.ObjectId, agencyId: Types.ObjectId): Promise<void> {
    // Build filter to include agencyId check in the query
    const filter: any = { _id: id };
    if (agencyId) {
      filter.agencyId = agencyId;
    }

    const result = await this.teamModel.findOneAndDelete(filter);
    if (!result) {
      throw new NotFoundException(`Team with ID ${id.toString()} not found`);
    }
  }

  async getTeamCount(agencyId: Types.ObjectId): Promise<number> {
    return this.teamModel.countDocuments({
      agencyId,
    });
  }
}
