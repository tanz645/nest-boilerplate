import { PaginationResponse } from '../../common/dto/pagination.dto';

export interface TeamResponse {
  id: string;
  name: string;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamCountResponse {
  count: number;
  maxTeams: number;
}

export type TeamsPaginatedResponse = PaginationResponse<TeamResponse>;
