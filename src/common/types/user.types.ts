import { UserRole } from '../constants/common.constant';
import { Types } from 'mongoose';

/**
 * Interface for user data with agency information used in the JWT auth guard
 */
export interface UserWithAgency {
  _id: Types.ObjectId;
  role: UserRole;
  agencyId?: Types.ObjectId;
}
