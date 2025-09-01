import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SALT_ROUNDS } from '../common/constants/common.constant';
import { UserRole } from '../common/constants/common.constant';
import { CreateUserData } from './types/user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const userToCreate: any = {
      ...userData,
      password: hashedPassword,
    };

    const newUser = new this.userModel(userToCreate);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async findByEmailAndRole(
    email: string,
    role: UserRole,
  ): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
        role,
      })
      .lean();
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).lean();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<User>,
  ): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, role, ...safeUpdateData } = updateData;

    return this.userModel.findByIdAndUpdate(id, safeUpdateData, { new: true });
  }

  async verifyEmail(token: string): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      {
        emailVerificationToken: token,
        emailVerificationTokenExpires: { $gt: new Date() },
      },
      {
        $set: { isEmailVerified: true },
        $unset: {
          emailVerificationToken: 1,
          emailVerificationTokenExpires: 1,
        },
      },
      { new: true },
    );

    return user;
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await this.userModel.findOneAndUpdate(
      { email },
      {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: expires,
      },
      { new: true },
    );

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({
        passwordResetToken: token,
        passwordResetTokenExpires: { $gt: new Date() },
      })
      .lean();

    if (!user) return false;

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetTokenExpires: undefined,
    });

    return true;
  }

  async updateEmailVerificationToken(
    email: string,
    token: string,
    expires: Date,
    role?: UserRole,
  ): Promise<User | null> {
    const query: any = { email };
    if (role) {
      query.role = role;
    }

    return this.userModel.findOneAndUpdate(
      query,
      { emailVerificationToken: token, emailVerificationTokenExpires: expires },
      { new: true },
    );
  }

  async deleteById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id);
    return !!result;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.findOneAndDelete({ email });
    return !!result;
  }

  async validateChampion(championId: Types.ObjectId): Promise<void> {
    try {
      const champion = await this.userModel
        .findById(championId)
        .select(['role', 'active'].join(' '))
        .lean();

      if (!champion) {
        throw new BadRequestException(
          `Champion user with ID ${championId.toString()} not found`,
        );
      }

      if (!champion.active) {
        throw new BadRequestException(
          `Champion user with ID ${championId.toString()} is not active`,
        );
      }

      if (champion.role !== UserRole.AGENCY) {
        throw new BadRequestException(
          `Champion user must be an agency user. Current role: ${champion.role}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Invalid champion user ID: ${championId.toString()}`,
      );
    }
  }

  async validateAssignedUserId(
    assignedUserId: Types.ObjectId,
    agencyId: Types.ObjectId,
  ): Promise<void> {
    await this.validateChampion(assignedUserId);

    const assignedUser = await this.findById(assignedUserId);

    if (assignedUser.role === UserRole.AGENCY) {
      if (!(assignedUser._id as Types.ObjectId).equals(agencyId)) {
        throw new BadRequestException(
          `Assigned user with ID ${assignedUserId.toString()} does not belong to the specified agency`,
        );
      }
    }
  }
}
