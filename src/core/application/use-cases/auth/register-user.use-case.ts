import {User} from '../../../domain/entities';
import {UserRepository} from '../../../domain/repositories';
import {Organization} from '../../../domain/entities';
import {OrganizationRepository} from '../../../domain/repositories';
import {randomUUID} from 'crypto';
import bcrypt from 'bcryptjs';

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organizationName: string;
}

export interface RegisterUserResponse {
  user: User;
  organization: Organization;
  accessToken: string;
  refreshToken: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(request.password, saltRounds);

    // Create user
    const user = new User({
      id: randomUUID(),
      email: request.email,
      passwordHash,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      isEmailVerified: false
    });

    // Create organization
    const organizationSlug = this.generateSlug(request.organizationName);
    const organization = new Organization({
      id: randomUUID(),
      name: request.organizationName,
      slug: organizationSlug,
      subscriptionPlan: 'free',
      subscriptionStatus: 'active'
    });

    // Save user and organization
    const savedUser = await this.userRepository.create(user);
    const savedOrganization =
      await this.organizationRepository.create(organization);

    // Add user as owner of organization
    await this.organizationRepository.addMember(
      savedOrganization.id,
      savedUser.id,
      'owner'
    );

    // Generate tokens
    const accessToken = this.generateAccessToken(savedUser);
    const refreshToken = this.generateRefreshToken(savedUser);

    return {
      user: savedUser,
      organization: savedOrganization,
      accessToken,
      refreshToken
    };
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).substr(2, 6)
    );
  }

  private generateAccessToken(user: User): string {
    // In a real implementation, use JWT
    return `access_${user.id}_${Date.now()}`;
  }

  private generateRefreshToken(user: User): string {
    // In a real implementation, use JWT
    return `refresh_${user.id}_${Date.now()}`;
  }
}
