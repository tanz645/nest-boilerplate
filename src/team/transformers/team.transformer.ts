import { TeamResponse } from '../types/team.types';

export class TeamTransformer {
  static toResponse(team: any): TeamResponse {
    return {
      id: String(team._id),
      name: team.name,
      agencyId: String(team.agencyId),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  static toResponseArray(teams: any[]): TeamResponse[] {
    return teams.map((team) => this.toResponse(team));
  }
}
