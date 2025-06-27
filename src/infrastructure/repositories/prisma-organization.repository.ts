import {PrismaClient} from '@prisma/client';
import {Organization} from '@/core/domain/entities';
import {OrganizationRepository} from '@/core/domain/repositories';

export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: {id}
    });

    return organization ? this.toDomain(organization) : null;
  }

  async getBySlug(slug: string): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: {slug}
    });

    return organization ? this.toDomain(organization) : null;
  }

  async create(organization: Organization): Promise<Organization> {
    const created = await this.prisma.organization.create({
      data: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        subscriptionPlan: organization.subscriptionPlan,
        subscriptionStatus: organization.subscriptionStatus,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async save(organization: Organization): Promise<void> {
    await this.prisma.organization.upsert({
      where: {id: organization.id},
      create: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        subscriptionPlan: organization.subscriptionPlan,
        subscriptionStatus: organization.subscriptionStatus,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt
      },
      update: {
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        subscriptionPlan: organization.subscriptionPlan,
        subscriptionStatus: organization.subscriptionStatus,
        updatedAt: organization.updatedAt
      }
    });
  }

  async update(organization: Organization): Promise<Organization> {
    const updated = await this.prisma.organization.update({
      where: {id: organization.id},
      data: {
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        subscriptionPlan: organization.subscriptionPlan,
        subscriptionStatus: organization.subscriptionStatus,
        updatedAt: organization.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: {id}
    });
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      }
    });

    return organizations.map((org) => this.toDomain(org));
  }

  async addMember(
    organizationId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role
      }
    });
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    await this.prisma.organizationMember.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId
        }
      }
    });
  }

  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await this.prisma.organizationMember.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId
        }
      },
      data: {
        role
      }
    });
  }

  async searchOrganizations(
    query: string,
    limit = 50
  ): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        OR: [{name: {contains: query}}, {description: {contains: query}}]
      },
      take: limit
    });

    return organizations.map((org) => this.toDomain(org));
  }

  async getAllActive(): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        subscriptionStatus: 'active'
      }
    });

    return organizations.map((org) => this.toDomain(org));
  }

  async findBySubscriptionPlan(plan: string): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        subscriptionPlan: plan
      }
    });

    return organizations.map((org) => this.toDomain(org));
  }

  async findBySubscriptionStatus(status: string): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: {
        subscriptionStatus: status
      }
    });

    return organizations.map((org) => this.toDomain(org));
  }

  async countTotalOrganizations(): Promise<number> {
    return this.prisma.organization.count();
  }

  async countBySubscriptionPlan(plan: string): Promise<number> {
    return this.prisma.organization.count({
      where: {
        subscriptionPlan: plan
      }
    });
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const existingOrg = await this.prisma.organization.findFirst({
      where: {
        slug,
        ...(excludeId && {id: {not: excludeId}})
      }
    });

    return !existingOrg;
  }

  private toDomain(organization: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    subscriptionPlan: string;
    subscriptionStatus: string;
    createdAt: Date;
    updatedAt: Date;
  }): Organization {
    return new Organization({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description ?? undefined,
      subscriptionPlan: organization.subscriptionPlan,
      subscriptionStatus: organization.subscriptionStatus,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt
    });
  }
}
