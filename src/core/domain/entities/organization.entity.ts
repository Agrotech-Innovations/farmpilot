import {BaseEntity} from './base.entity';

export interface OrganizationProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Organization extends BaseEntity {
  public readonly name: string;
  public readonly slug: string;
  public readonly description?: string;
  public readonly subscriptionPlan: string;
  public readonly subscriptionStatus: string;

  constructor(props: OrganizationProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.name, 'Organization name');
    this.validateRequired(props.slug, 'Organization slug');

    // Validate slug format (lowercase, alphanumeric with hyphens)
    if (!this.validateSlug(props.slug)) {
      throw new Error(
        'Slug must contain only lowercase letters, numbers, and hyphens'
      );
    }

    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.subscriptionPlan = props.subscriptionPlan ?? 'free';
    this.subscriptionStatus = props.subscriptionStatus ?? 'active';
  }

  public updateDetails(name: string, description?: string): Organization {
    this.validateRequired(name, 'Organization name');

    return new Organization({
      ...this.toProps(),
      name,
      description,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateSubscription(plan: string, status: string): Organization {
    this.validateRequired(plan, 'Subscription plan');
    this.validateRequired(status, 'Subscription status');

    const validPlans = ['free', 'basic', 'premium'];
    const validStatuses = ['active', 'canceled', 'past_due'];

    if (!validPlans.includes(plan)) {
      throw new Error(`Invalid subscription plan: ${plan}`);
    }

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid subscription status: ${status}`);
    }

    return new Organization({
      ...this.toProps(),
      subscriptionPlan: plan,
      subscriptionStatus: status,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public isActive(): boolean {
    return this.subscriptionStatus === 'active';
  }

  public isPremium(): boolean {
    return this.subscriptionPlan === 'premium' && this.isActive();
  }

  public canCreateFarms(): boolean {
    return this.isActive();
  }

  public getMaxFarms(): number {
    switch (this.subscriptionPlan) {
      case 'free':
        return 1;
      case 'basic':
        return 5;
      case 'premium':
        return 100;
      default:
        return 1;
    }
  }

  private validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
  }

  private toProps(): OrganizationProps {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      subscriptionPlan: this.subscriptionPlan,
      subscriptionStatus: this.subscriptionStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
