import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamLimitExceededException extends HttpException {
  constructor(maxTeams: number) {
    super(
      `Maximum number of teams (${maxTeams}) reached for this agency`,
      HttpStatus.FORBIDDEN,
    );
  }
}
