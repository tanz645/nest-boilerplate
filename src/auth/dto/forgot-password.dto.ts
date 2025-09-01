import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
