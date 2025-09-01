export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  active: boolean;
  teams: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UserTransformer {
  static toResponse(user: any): UserResponseDto {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      active: user.active,
      teams: user.teams || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseArray(users: any[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
