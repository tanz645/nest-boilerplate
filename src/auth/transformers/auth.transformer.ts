export interface LoginResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  agencyId?: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: LoginResponseDto;
}

export class AuthTransformer {
  static toLoginResponse(
    user: any,
    includeAgencyId: boolean = false,
  ): LoginResponseDto {
    const response: LoginResponseDto = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    if (includeAgencyId && user.agencyId) {
      response.agencyId = String(user.agencyId);
    }

    return response;
  }

  static toAuthResponse(
    user: any,
    accessToken: string,
    includeAgencyId: boolean = false,
  ): AuthResponseDto {
    return {
      access_token: accessToken,
      user: this.toLoginResponse(user, includeAgencyId),
    };
  }
}
