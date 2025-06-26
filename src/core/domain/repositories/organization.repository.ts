import {Organization} from '../entities';

export interface OrganizationRepository {
  // Basic CRUD operations
  getById(id: string): Promise<Organization | null>;
  getBySlug(slug: string): Promise<Organization | null>;
  create(organization: Organization): Promise<Organization>;
  save(organization: Organization): Promise<void>;
  update(organization: Organization): Promise<Organization>;
  delete(id: string): Promise<void>;

  // User organization membership
  findByUserId(userId: string): Promise<Organization[]>;
  addMember(
    organizationId: string,
    userId: string,
    role: string
  ): Promise<void>;
  removeMember(organizationId: string, userId: string): Promise<void>;
  updateMemberRole(
    organizationId: string,
    userId: string,
    role: string
  ): Promise<void>;

  // Search and listing
  searchOrganizations(query: string, limit?: number): Promise<Organization[]>;
  getAllActive(): Promise<Organization[]>;

  // Subscription management
  findBySubscriptionPlan(plan: string): Promise<Organization[]>;
  findBySubscriptionStatus(status: string): Promise<Organization[]>;

  // Statistics
  countTotalOrganizations(): Promise<number>;
  countBySubscriptionPlan(plan: string): Promise<number>;

  // Slug availability
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>;
}
