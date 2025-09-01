import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../common/constants/common.constant';

export type TeamDocument = HydratedDocument<Team>;

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (agencyId: Types.ObjectId) {
        const UserModel = this.constructor.model('User');
        const user = await UserModel.findById(agencyId);
        return user && user.role === UserRole.AGENCY;
      },
      message: 'Agency ID must reference a user with agency role',
    },
  })
  agencyId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ name: 1, agencyId: 1 }, { unique: true });
