import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'Team name must be a string' })
  @IsNotEmpty({ message: 'Team name is required' })
  @MinLength(2, { message: 'Team name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Team name cannot exceed 100 characters' })
  name: string;
}
