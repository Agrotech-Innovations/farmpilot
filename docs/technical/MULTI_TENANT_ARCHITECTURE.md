# Multi-Tenant Architecture Implementation

## Overview

Farm Pilot implements a comprehensive multi-tenant architecture that allows multiple organizations to use the platform independently while sharing the same infrastructure. This design provides data isolation, scalability, and subscription-based access control.

## 🏗️ **Architecture Components**

### **Tenant Isolation Strategy**

Farm Pilot uses a **shared database, shared schema** approach with **row-level security (RLS)** through application-level filtering:

```
┌─────────────────────────────────────────────────────────────┐
│                    Farm Pilot Application                    │
├─────────────────────────────────────────────────────────────┤
│                  Organization Layer                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Org Alpha  │ │  Org Beta   │ │  Org Gamma  │           │
│  │  - 3 Farms  │ │  - 1 Farm   │ │  - 5 Farms  │           │
│  │  - 5 Users  │ │  - 2 Users  │ │  - 12 Users │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                    Shared Database                          │
│  All organizations share tables with organizationId FK     │
└─────────────────────────────────────────────────────────────┘
```

### **Data Model Structure**

#### **Core Tenant Entity**

```typescript
interface Organization {
  id: string; // Unique tenant identifier
  name: string; // Organization display name
  slug: string; // URL-friendly identifier
  subscriptionTier: string; // 'free' | 'basic' | 'premium' | 'enterprise'
  maxFarms: number; // Subscription-based farm limit
  maxUsers: number; // Subscription-based user limit
  isActive: boolean; // Organization status
  createdAt: Date;
  updatedAt: Date;
}
```

#### **User-Organization Relationship**

```typescript
interface User {
  id: string;
  email: string;
  organizationId: string; // FK to Organization
  role: 'owner' | 'admin' | 'manager' | 'worker';
  permissions: string[]; // Fine-grained permissions
  isActive: boolean;
  // ... other user fields
}
```

## 🔐 **Security & Access Control**

### **Row-Level Security Implementation**

All database queries automatically filter by `organizationId` through repository-level enforcement:

```typescript
// Example: Repository automatically filters by organization
export class PrismaFarmRepository implements FarmRepository {
  async findByOrganization(organizationId: string): Promise<Farm[]> {
    return this.prisma.farm.findMany({
      where: {organizationId} // Automatic tenant filtering
    });
  }

  async save(farm: Farm): Promise<void> {
    // Validate organization access before save
    await this.validateOrganizationAccess(farm.organizationId);
    // ... save logic
  }
}
```

### **JWT Token Structure**

JWT tokens include organizational context for request-level security:

```typescript
interface JwtPayload {
  userId: string;
  email: string;
  organizationIds: string[]; // User may belong to multiple orgs
  currentOrganizationId: string; // Active organization for this session
  role: string;
  permissions: string[];
  type: 'access' | 'refresh' | 'temp';
}
```

### **API Endpoint Security**

All server functions validate organizational access:

```typescript
export const createFarm = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  // 1. Validate JWT and extract user context
  const userContext = await validateAuthToken(request);

  // 2. Validate organization access
  if (data.organizationId !== userContext.currentOrganizationId) {
    throw new Error('Unauthorized organization access');
  }

  // 3. Check subscription limits
  await validateSubscriptionLimits(userContext.organizationId, 'farms');

  // 4. Proceed with business logic
  const createFarmUseCase =
    container.get<CreateFarmUseCase>('createFarmUseCase');
  return await createFarmUseCase.execute(data);
});
```

## 👥 **User Management & Roles**

### **Role Hierarchy**

```
Owner (1 per org)
├── Full administrative access
├── Billing and subscription management
├── Can add/remove users and farms
└── Can delete organization

Admin (Multiple allowed)
├── User management (except owner)
├── Farm and operational management
├── Can view billing information
└── Cannot delete organization

Manager (Multiple allowed)
├── Operational management
├── Can manage livestock, inventory, tasks
├── Cannot manage users or billing
└── Limited to assigned farms

Worker (Multiple allowed)
├── Day-to-day operations
├── Can view and update assigned tasks
├── Cannot manage farms or users
└── Read-only access to reports
```

### **Permission System**

Fine-grained permissions for granular access control:

```typescript
const PERMISSIONS = {
  // Farm Management
  'farms.create': 'Create new farms',
  'farms.read': 'View farm information',
  'farms.update': 'Update farm details',
  'farms.delete': 'Delete farms',

  // User Management
  'users.invite': 'Invite new users',
  'users.manage': 'Manage user roles',
  'users.remove': 'Remove users',

  // Livestock Management
  'livestock.create': 'Add new animals',
  'livestock.health.manage': 'Manage health records',
  'livestock.breeding.manage': 'Manage breeding records',

  // Financial Access
  'billing.view': 'View billing information',
  'billing.manage': 'Manage subscriptions',
  'reports.financial': 'Access financial reports',

  // System Administration
  'organization.settings': 'Manage org settings',
  'organization.delete': 'Delete organization'
} as const;
```

## 📊 **Subscription Management**

### **Subscription Tiers**

```typescript
interface SubscriptionTier {
  name: string;
  maxFarms: number;
  maxUsers: number;
  maxAnimalsPerFarm: number;
  features: string[];
  pricePerMonth: number;
}

const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    name: 'Free',
    maxFarms: 1,
    maxUsers: 2,
    maxAnimalsPerFarm: 50,
    features: ['basic_livestock', 'basic_inventory'],
    pricePerMonth: 0
  },

  basic: {
    name: 'Basic',
    maxFarms: 3,
    maxUsers: 5,
    maxAnimalsPerFarm: 200,
    features: ['advanced_health', 'vaccination_scheduling', 'basic_analytics'],
    pricePerMonth: 29
  },

  premium: {
    name: 'Premium',
    maxFarms: 10,
    maxUsers: 15,
    maxAnimalsPerFarm: 1000,
    features: [
      'breeding_management',
      'advanced_analytics',
      'weather_integration'
    ],
    pricePerMonth: 79
  },

  enterprise: {
    name: 'Enterprise',
    maxFarms: -1, // Unlimited
    maxUsers: -1, // Unlimited
    maxAnimalsPerFarm: -1, // Unlimited
    features: ['all_features', 'api_access', 'priority_support'],
    pricePerMonth: 199
  }
};
```

### **Subscription Limit Enforcement**

```typescript
export class SubscriptionService {
  async validateLimit(
    organizationId: string,
    resource: 'farms' | 'users' | 'animals',
    currentCount?: number
  ): Promise<boolean> {
    const org = await this.getOrganization(organizationId);
    const tier = SUBSCRIPTION_TIERS[org.subscriptionTier];

    switch (resource) {
      case 'farms':
        if (tier.maxFarms === -1) return true;
        const farmCount =
          currentCount ?? (await this.getFarmCount(organizationId));
        return farmCount < tier.maxFarms;

      case 'users':
        if (tier.maxUsers === -1) return true;
        const userCount =
          currentCount ?? (await this.getUserCount(organizationId));
        return userCount < tier.maxUsers;

      case 'animals':
        if (tier.maxAnimalsPerFarm === -1) return true;
        // Check per-farm animal limits
        return await this.validateAnimalLimits(
          organizationId,
          tier.maxAnimalsPerFarm
        );
    }
  }
}
```

## 🔄 **Organization Lifecycle**

### **Organization Creation**

1. **User Registration**: New user creates account and organization simultaneously
2. **Organization Setup**: Default settings, subscription tier assignment
3. **Initial Farm Creation**: Optional farm setup during onboarding
4. **User Invitation**: Owner can invite additional users

```typescript
export class RegisterUserUseCase {
  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // 1. Create organization first
    const organization = new Organization({
      name: request.organizationName,
      slug: this.generateSlug(request.organizationName),
      subscriptionTier: 'free',
      maxFarms: 1,
      maxUsers: 2,
      isActive: true
    });

    // 2. Create user as organization owner
    const user = new User({
      email: request.email,
      organizationId: organization.id,
      role: 'owner',
      permissions: this.getOwnerPermissions(),
      isActive: true
    });

    // 3. Save both entities
    await this.organizationRepository.save(organization);
    await this.userRepository.save(user);

    return {user, organization};
  }
}
```

### **Organization Deletion**

```typescript
export class DeleteOrganizationUseCase {
  async execute(
    organizationId: string,
    requestingUserId: string
  ): Promise<void> {
    // 1. Verify user has deletion permissions
    const user = await this.userRepository.findById(requestingUserId);
    if (user.role !== 'owner') {
      throw new Error('Only organization owner can delete organization');
    }

    // 2. Cascade delete all related data
    await this.deleteAllFarms(organizationId);
    await this.deleteAllUsers(organizationId);
    await this.deleteAllData(organizationId);

    // 3. Delete organization
    await this.organizationRepository.delete(organizationId);
  }
}
```

## 🚀 **Scalability Features**

### **Database Partitioning Strategy**

While currently using a single database, the architecture supports future partitioning:

```typescript
// Future: Horizontal partitioning by organization
interface DatabaseRouter {
  getConnectionForOrganization(organizationId: string): DatabaseConnection;
  routeQuery(organizationId: string, query: Query): Promise<Result>;
}
```

### **Caching Strategy**

Organization-aware caching for performance:

```typescript
class OrganizationCache {
  private cache = new Map<string, CacheEntry>();

  async get<T>(organizationId: string, key: string): Promise<T | null> {
    const cacheKey = `${organizationId}:${key}`;
    return this.cache.get(cacheKey)?.data ?? null;
  }

  async set<T>(
    organizationId: string,
    key: string,
    data: T,
    ttl: number
  ): Promise<void> {
    const cacheKey = `${organizationId}:${key}`;
    this.cache.set(cacheKey, {data, expires: Date.now() + ttl});
  }
}
```

## 📈 **Monitoring & Analytics**

### **Per-Organization Metrics**

```typescript
interface OrganizationMetrics {
  organizationId: string;
  activeUsers: number;
  farmsCount: number;
  animalsCount: number;
  apiCallsPerDay: number;
  storageUsed: number; // In MB
  subscriptionTier: string;
  lastActivity: Date;
}
```

### **Usage Analytics**

```typescript
export class OrganizationAnalyticsUseCase {
  async getUsageMetrics(organizationId: string): Promise<UsageMetrics> {
    return {
      farms: await this.farmRepository.countByOrganization(organizationId),
      users: await this.userRepository.countByOrganization(organizationId),
      animals:
        await this.livestockRepository.countByOrganization(organizationId),
      tasks: await this.taskRepository.countByOrganization(organizationId),
      subscriptionUsage: await this.calculateSubscriptionUsage(organizationId)
    };
  }
}
```

## 🛡️ **Data Privacy & Compliance**

### **Data Isolation Guarantees**

1. **Application-Level Filtering**: All queries automatically filter by `organizationId`
2. **API Validation**: Every endpoint validates organizational access
3. **Audit Logging**: All cross-organization access attempts are logged
4. **Data Encryption**: Sensitive data encrypted at rest and in transit

### **GDPR Compliance**

```typescript
export class DataPrivacyService {
  async exportOrganizationData(
    organizationId: string
  ): Promise<OrganizationDataExport> {
    // Export all organization data in portable format
    return {
      organization: await this.getOrganizationData(organizationId),
      users: await this.getUserData(organizationId),
      farms: await this.getFarmData(organizationId),
      livestock: await this.getLivestockData(organizationId)
      // ... all related data
    };
  }

  async deleteOrganizationData(organizationId: string): Promise<void> {
    // Permanently delete all organization data
    await this.cascadeDeleteAllData(organizationId);
  }
}
```

## 🔧 **Implementation Examples**

### **Multi-Tenant Repository Pattern**

```typescript
export abstract class BaseTenantRepository<T> {
  protected async validateTenantAccess(organizationId: string): Promise<void> {
    const org = await this.prisma.organization.findUnique({
      where: {id: organizationId, isActive: true}
    });

    if (!org) {
      throw new Error('Invalid or inactive organization');
    }
  }

  protected addTenantFilter(where: any, organizationId: string): any {
    return {
      ...where,
      organizationId
    };
  }
}

export class PrismaFarmRepository
  extends BaseTenantRepository<Farm>
  implements FarmRepository
{
  async findByOrganization(organizationId: string): Promise<Farm[]> {
    await this.validateTenantAccess(organizationId);

    const farms = await this.prisma.farm.findMany({
      where: this.addTenantFilter({}, organizationId)
    });

    return farms.map(this.toDomainEntity);
  }
}
```

### **Multi-Tenant Use Case Pattern**

```typescript
export class CreateFarmUseCase {
  async execute(request: CreateFarmRequest): Promise<Farm> {
    // 1. Validate organizational access
    await this.validateOrganizationAccess(request.organizationId);

    // 2. Check subscription limits
    await this.subscriptionService.validateLimit(
      request.organizationId,
      'farms'
    );

    // 3. Create farm with organization context
    const farm = new Farm({
      ...request,
      organizationId: request.organizationId
    });

    // 4. Save with tenant isolation
    await this.farmRepository.save(farm);

    return farm;
  }

  private async validateOrganizationAccess(
    organizationId: string
  ): Promise<void> {
    const org = await this.organizationRepository.findById(organizationId);
    if (!org || !org.isActive) {
      throw new Error('Invalid or inactive organization');
    }
  }
}
```

## 🎯 **Best Practices**

### **Development Guidelines**

1. **Always Filter by Organization**: Every query must include `organizationId`
2. **Validate Access Early**: Check organizational access at the beginning of use cases
3. **Respect Subscription Limits**: Validate limits before creating resources
4. **Audit Everything**: Log all organizational access and changes
5. **Test Isolation**: Ensure tests validate tenant isolation

### **Security Checklist**

- [ ] All API endpoints validate organizational access
- [ ] Database queries include `organizationId` filtering
- [ ] JWT tokens include organizational context
- [ ] Subscription limits are enforced
- [ ] Cross-tenant access attempts are logged and blocked
- [ ] Data export/deletion capabilities for compliance

### **Performance Considerations**

1. **Index Strategy**: All tenant-filtered queries should have composite indexes
2. **Connection Pooling**: Consider per-tenant connection pools for large deployments
3. **Caching**: Implement organization-aware caching strategies
4. **Monitoring**: Track per-organization resource usage

## 🚀 **Future Enhancements**

### **Planned Features**

1. **Organization Switching**: Users belonging to multiple organizations
2. **Cross-Organization Sharing**: Controlled data sharing between organizations
3. **Advanced Billing**: Usage-based billing and automatic scaling
4. **Organization Templates**: Pre-configured setups for different farm types
5. **Federated Identity**: SSO integration for enterprise customers

### **Scalability Roadmap**

1. **Database Sharding**: Partition data by organization for extreme scale
2. **Regional Deployment**: Deploy organization data in specific geographic regions
3. **Microservices**: Split into organization-aware microservices
4. **Event Sourcing**: Implement event sourcing for audit and compliance

This multi-tenant architecture provides a solid foundation for scaling Farm Pilot to thousands of organizations while maintaining data security, performance, and compliance with agricultural industry standards.
