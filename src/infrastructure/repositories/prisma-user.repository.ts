import {PrismaClient} from '@prisma/client';
import {User} from '@/core/domain/entities';
import {
  UserRepository,
  OAuthProviderData,
  UserOrganization
} from '@/core/domain/repositories';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<User | null> {
    return this.findById(id);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {id}
    });

    return user ? this.toDomain(user) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.findByEmail(email);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {email}
    });

    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        twoFactorBackupCodes: user.twoFactorBackupCodes
          ? JSON.stringify(user.twoFactorBackupCodes)
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: {id: user.id},
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        twoFactorBackupCodes: user.twoFactorBackupCodes
          ? JSON.stringify(user.twoFactorBackupCodes)
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      update: {
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        twoFactorBackupCodes: user.twoFactorBackupCodes
          ? JSON.stringify(user.twoFactorBackupCodes)
          : null,
        updatedAt: user.updatedAt
      }
    });
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: {id: user.id},
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLoginAt: user.lastLoginAt,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        twoFactorBackupCodes: user.twoFactorBackupCodes
          ? JSON.stringify(user.twoFactorBackupCodes)
          : null,
        updatedAt: user.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {id}
    });
  }

  async findByEmailAndPassword(
    email: string,
    passwordHash: string
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        passwordHash
      }
    });

    return user ? this.toDomain(user) : null;
  }

  async updateTwoFactorSecret(
    userId: string,
    secret: string,
    backupCodes: string[]
  ): Promise<void> {
    await this.prisma.user.update({
      where: {id: userId},
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
        updatedAt: new Date()
      }
    });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {id: userId},
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {id: userId},
      data: {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        organizationMemberships: {
          some: {
            organizationId
          }
        }
      }
    });

    return users.map((user) => this.toDomain(user));
  }

  async searchUsers(query: string, limit = 50): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {firstName: {contains: query}},
          {lastName: {contains: query}},
          {email: {contains: query}}
        ]
      },
      take: limit
    });

    return users.map((user) => this.toDomain(user));
  }

  async countTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countActiveUsers(daysActive = 30): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - daysActive);

    return this.prisma.user.count({
      where: {
        lastLoginAt: {
          gte: date
        }
      }
    });
  }

  // OAuth methods
  async saveOAuthProvider(data: OAuthProviderData): Promise<void> {
    await this.prisma.oAuthProvider.upsert({
      where: {
        provider_providerId: {
          provider: data.provider,
          providerId: data.providerId
        }
      },
      create: {
        userId: data.userId,
        provider: data.provider,
        providerId: data.providerId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      },
      update: {
        userId: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        updatedAt: new Date()
      }
    });
  }

  async findByOAuthProvider(
    provider: string,
    providerId: string
  ): Promise<User | null> {
    const oauthProvider = await this.prisma.oAuthProvider.findFirst({
      where: {
        provider,
        providerId
      },
      include: {
        user: true
      }
    });

    return oauthProvider ? this.toDomain(oauthProvider.user) : null;
  }

  async removeOAuthProvider(userId: string, provider: string): Promise<void> {
    await this.prisma.oAuthProvider.deleteMany({
      where: {
        userId,
        provider
      }
    });
  }

  // Organization methods
  async findUserOrganizations(userId: string): Promise<UserOrganization[]> {
    const memberships = await this.prisma.organizationMember.findMany({
      where: {
        userId
      },
      include: {
        organization: true
      }
    });

    return memberships.map((membership: any) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role
    }));
  }

  private toDomain(user: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    isEmailVerified: boolean;
    emailVerifiedAt: Date | null;
    lastLoginAt: Date | null;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    twoFactorBackupCodes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? undefined,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      lastLoginAt: user.lastLoginAt ?? undefined,
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorSecret: user.twoFactorSecret ?? undefined,
      twoFactorBackupCodes: user.twoFactorBackupCodes
        ? JSON.parse(user.twoFactorBackupCodes)
        : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }
}
