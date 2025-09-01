import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { EmailService } from '../common/services/email.service';

import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailAlreadyExistsException } from '../common/exceptions/email-already-exists.exception';
import { UserRole } from '../common/constants/common.constant';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthTransformer } from './transformers/auth.transformer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(registerData: CreateAuthDto) {
    // Check for existing user with same email
    const existingUser = await this.userService.findByEmail(registerData.email);

    if (existingUser) {
      throw new EmailAlreadyExistsException(registerData.email);
    }

    let user: any;
    try {
      // Create user with AGENCY role
      const userData = {
        ...registerData,
        role: UserRole.AGENCY,
      };
      user = await this.userService.create(userData);

      // Generate verification token
      const verificationToken = this.jwtService.sign(
        { email: user.email },
        { expiresIn: '1d' },
      );

      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      // Update verification token
      await this.userService.updateEmailVerificationToken(
        user.email,
        verificationToken,
        expires,
        UserRole.AGENCY,
      );

      // Send verification email
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      // If user was created but subsequent steps failed, delete the user
      if (user && user._id) {
        try {
          await this.userService.deleteById(user._id);
        } catch {
          // Silently handle delete error
        }
      }

      throw error;
    }
  }

  async login(loginData: LoginDto) {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is an agency user
    if (user.role !== UserRole.AGENCY) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.matchPassword(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password not matched');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return AuthTransformer.toAuthResponse(user, accessToken, false);
  }

  async verifyEmail(verifyEmailData: VerifyEmailDto) {
    const user = await this.userService.verifyEmail(verifyEmailData.token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordDto) {
    const resetToken = await this.userService.createPasswordResetToken(
      forgotPasswordData.email,
    );
    if (!resetToken) {
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    const user = await this.userService.findByEmail(forgotPasswordData.email);
    if (user) {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
      );
    }

    return {
      message: 'If the email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(resetPasswordData: ResetPasswordDto) {
    const success = await this.userService.resetPassword(
      resetPasswordData.token,
      resetPasswordData.newPassword,
    );

    if (!success) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { message: 'Password reset successfully' };
  }

  async matchPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(password, hash);
  }
}
