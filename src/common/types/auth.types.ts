import { UserRole } from '../constants/common.constant';
import { Types } from 'mongoose';

/**
 * Authenticated user data attached to request by JWT auth guard
 */
export interface AuthenticatedUser {
  id: Types.ObjectId;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
}

/**
 * Request with authenticated user data
 */
export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}
