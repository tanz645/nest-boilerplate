import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../common/constants/common.constant';
import { MAX_TEAMS_PER_AGENCY } from '../../common/constants/common.constant';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.AGENCY,
  })
  role: UserRole;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (teams: string[]) {
        return !teams || teams.length <= MAX_TEAMS_PER_AGENCY;
      },
      message: `Teams array cannot exceed ${MAX_TEAMS_PER_AGENCY} items`,
    },
  })
  teams: string[];

  @Prop({ unique: true, sparse: true })
  emailVerificationToken: string;

  @Prop()
  emailVerificationTokenExpires: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetTokenExpires: Date;

  @Prop({ default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add unique index for email + role
UserSchema.index(
  { email: 1, role: 1 },
  {
    unique: true,
  },
);
