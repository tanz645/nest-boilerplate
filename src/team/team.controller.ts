import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseFilters,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ObjectIdUtil } from '../common/utils/object-id.util';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Team } from './entities/team.entity';
import {
  TeamCountResponse,
  TeamsPaginatedResponse,
  TeamResponse,
} from './types/team.types';
import { UserRole } from '../common/constants/common.constant';
import { DuplicateKeyFilter } from '../common/filters/duplicate-key.filter';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthenticatedRequest } from '../common/types/auth.types';

@Controller('teams')
@UseGuards(RolesGuard)
@Roles(UserRole.AGENCY)
@UseFilters(DuplicateKeyFilter)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Team> {
    return this.teamService.create(createTeamDto, req.user.id);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<TeamsPaginatedResponse> {
    return this.teamService.findAllPaginated(req.user.id, paginationDto);
  }

  @Get('count')
  async getTeamCount(
    @Req() req: AuthenticatedRequest,
  ): Promise<TeamCountResponse> {
    const count = await this.teamService.getTeamCount(req.user.id);
    return { count, maxTeams: 30 };
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<TeamResponse> {
    return this.teamService.findOne(
      ObjectIdUtil.fromHexString(id),
      req.user.id,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TeamResponse> {
    return this.teamService.update(
      ObjectIdUtil.fromHexString(id),
      updateTeamDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.teamService.remove(ObjectIdUtil.fromHexString(id), req.user.id);
  }
}
