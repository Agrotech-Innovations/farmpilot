import {UserRepository, UserOrganization} from '@/core/domain/repositories';
import {User} from '@/core/domain/entities';
import {JwtService} from '@/infrastructure/auth/jwt.service';

export interface OAuthLoginRequest {
  provider: string;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface OAuthLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export class OAuthLoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: OAuthLoginRequest): Promise<OAuthLoginResponse> {
    // Try to find existing user by email
    let user = await this.userRepository.findByEmail(request.email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        id: crypto.randomUUID(),
        email: request.email,
        passwordHash: '', // OAuth users don't have passwords
        firstName: request.firstName,
        lastName: request.lastName,
        isEmailVerified: true, // OAuth emails are pre-verified
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.userRepository.save(user);
      isNewUser = true;
    }

    // Save/update OAuth provider info
    await this.userRepository.saveOAuthProvider({
      userId: user.id,
      provider: request.provider,
      providerId: request.providerId,
      accessToken: request.accessToken,
      refreshToken: request.refreshToken,
      expiresAt: request.accessToken
        ? new Date(Date.now() + 3600000)
        : undefined // 1 hour
    });

    // Update last login
    const updatedUser = user.updateLastLogin();
    await this.userRepository.save(updatedUser);

    // Get user's organizations
    const organizations: UserOrganization[] =
      await this.userRepository.findUserOrganizations(user.id);
    const organizationIds = organizations.map(
      (org: UserOrganization) => org.id
    );

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken(
      updatedUser,
      organizationIds
    );
    const refreshToken = this.jwtService.generateRefreshToken(
      updatedUser,
      organizationIds
    );

    return {
      user: updatedUser,
      accessToken,
      refreshToken,
      isNewUser
    };
  }
}
