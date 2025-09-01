import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'Verification token is required' })
  @IsString({ message: 'Verification token must be a string' })
  token: string;
}
