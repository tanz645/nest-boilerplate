import { Types } from 'mongoose';
import { UserRole } from '../../common/constants/common.constant';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  agencyId?: Types.ObjectId;
}
