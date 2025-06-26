import {User} from '../entities';

export interface OAuthProviderData {
  userId: string;
  provider: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export interface UserRepository {
  // Basic CRUD operations
  getById(id: string): Promise<User | null>;
  findById(id: string): Promise<User | null>; // Alias for getById
  getByEmail(email: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>; // Alias for getByEmail
  create(user: User): Promise<User>;
  save(user: User): Promise<void>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;

  // Authentication specific
  findByEmailAndPassword(
    email: string,
    passwordHash: string
  ): Promise<User | null>;

  // OAuth authentication
  saveOAuthProvider(data: OAuthProviderData): Promise<void>;
  findByOAuthProvider(
    provider: string,
    providerId: string
  ): Promise<User | null>;
  removeOAuthProvider(userId: string, provider: string): Promise<void>;

  // Organization management
  findUserOrganizations(userId: string): Promise<UserOrganization[]>;

  // Two-factor authentication
  updateTwoFactorSecret(
    userId: string,
    secret: string,
    backupCodes: string[]
  ): Promise<void>;

  // Email verification
  markEmailAsVerified(userId: string): Promise<void>;

  // Profile updates
  updateLastLogin(userId: string): Promise<void>;

  // Admin/management operations
  findByOrganization(organizationId: string): Promise<User[]>;
  searchUsers(query: string, limit?: number): Promise<User[]>;

  // Statistics
  countTotalUsers(): Promise<number>;
  countActiveUsers(daysActive?: number): Promise<number>;
}
