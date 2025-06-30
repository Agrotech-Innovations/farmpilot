# Farm Pilot - Developer Setup Guide

This guide will help you set up the Farm Pilot development environment and understand the codebase structure.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
git --version   # Any recent version
```

### 2. Clone and Setup

```bash
git clone <repository-url>
cd farmpilot
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with these minimum settings:

```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="dev-access-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
```

### 4. Database Setup

```bash
npm run db:generate
npm run db:push
```

### 5. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📂 Project Structure Deep Dive

### Core Domain Layer (`src/core/domain/`)

**Entities** - Pure business objects

```typescript
// Example: src/core/domain/entities/farm.entity.ts
export class Farm extends BaseEntity {
  public readonly name: string;
  public readonly totalAcres?: number;

  constructor(props: FarmProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validateRequired(props.name, 'Farm name');
    this.name = props.name;
    this.totalAcres = props.totalAcres;
  }

  public updateBasicInfo(name: string): Farm {
    return new Farm({...this.toProps(), name});
  }
}
```

**Repositories** - Data access contracts

```typescript
// Example: src/core/domain/repositories/farm.repository.ts
export interface FarmRepository {
  getById(id: string): Promise<Farm | null>;
  create(farm: Farm): Promise<Farm>;
  findByOrganization(organizationId: string): Promise<Farm[]>;
}
```

### Application Layer (`src/core/application/`)

**Use Cases** - Business logic orchestration

```typescript
// Example: src/core/application/use-cases/farm/create-farm.use-case.ts
export class CreateFarmUseCase {
  constructor(
    private farmRepository: FarmRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(request: CreateFarmRequest): Promise<CreateFarmResponse> {
    // 1. Validate organization exists
    const organization = await this.organizationRepository.getById(
      request.organizationId
    );
    if (!organization) throw new Error('Organization not found');

    // 2. Check farm limits
    const existingFarms = await this.farmRepository.findByOrganization(
      request.organizationId
    );
    if (existingFarms.length >= organization.getMaxFarms()) {
      throw new Error('Maximum farms reached');
    }

    // 3. Create and save farm
    const farm = new Farm({id: randomUUID(), ...request});
    return {farm: await this.farmRepository.create(farm)};
  }
}
```

### Infrastructure Layer (`src/infrastructure/`)

**Repository Implementations**

```typescript
// Example: src/infrastructure/repositories/prisma-farm.repository.ts
export class PrismaFarmRepository implements FarmRepository {
  constructor(private prisma: PrismaClient) {}

  async create(farm: Farm): Promise<Farm> {
    const created = await this.prisma.farm.create({
      data: {
        id: farm.id,
        name: farm.name,
        totalAcres: farm.totalAcres
        // ... other fields
      }
    });
    return this.toDomain(created);
  }
}
```

**Dependency Injection**

```typescript
// src/infrastructure/di/container.ts
class DIContainer {
  constructor() {
    // Infrastructure
    const farmRepository = new PrismaFarmRepository(prisma);
    const organizationRepository = new PrismaOrganizationRepository(prisma);

    // Use Cases
    const createFarmUseCase = new CreateFarmUseCase(
      farmRepository,
      organizationRepository
    );

    this.dependencies = {farmRepository, createFarmUseCase};
  }
}
```

### Presentation Layer (`src/presentation/`)

**Controllers** - API endpoints

```typescript
// src/presentation/controllers/farm.controller.ts
export const createFarm = createServerFn('POST', async (data: unknown) => {
  try {
    const validatedData = createFarmSchema.parse(data);
    const createFarmUseCase =
      container.get<CreateFarmUseCase>('CreateFarmUseCase');
    const result = await createFarmUseCase.execute(validatedData);
    return {success: true, data: result};
  } catch (error) {
    return {success: false, error: error.message};
  }
});
```

## 🔧 Development Workflow

### Adding a New Feature

**Step 1: Domain Entity**

```bash
# Create new entity
touch src/core/domain/entities/field.entity.ts
```

```typescript
export class Field extends BaseEntity {
  constructor(props: FieldProps) {
    super(props.id);
    this.validateRequired(props.name, 'Field name');
    this.validatePositiveNumber(props.acres, 'Acres');
  }
}
```

**Step 2: Repository Interface**

```bash
touch src/core/domain/repositories/field.repository.ts
```

**Step 3: Use Cases**

```bash
mkdir -p src/core/application/use-cases/field
touch src/core/application/use-cases/field/create-field.use-case.ts
```

**Step 4: Infrastructure Implementation**

```bash
touch src/infrastructure/repositories/prisma-field.repository.ts
```

**Step 5: Update DI Container**

```typescript
// Add to src/infrastructure/di/container.ts
const fieldRepository = new PrismaFieldRepository(prisma);
const createFieldUseCase = new CreateFieldUseCase(fieldRepository);
```

**Step 6: Controller**

```bash
touch src/presentation/controllers/field.controller.ts
```

**Step 7: Tests**

```bash
touch src/tests/domain/entities/field.entity.test.ts
touch src/tests/application/use-cases/create-field.use-case.test.ts
```

### Database Changes

**1. Update Prisma Schema**

```prisma
// prisma/schema.prisma
model Field {
  id          String   @id @default(cuid())
  farmId      String
  name        String
  acres       Float
  soilType    String?
  farm        Farm     @relation(fields: [farmId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("fields")
}
```

**2. Generate and Apply Migration**

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply to database (dev)
# OR for production:
npm run db:migrate   # Create migration file
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// src/tests/domain/entities/farm.entity.test.ts
describe('Farm Entity', () => {
  it('should create farm with valid data', () => {
    const farm = new Farm({
      id: 'test-id',
      organizationId: 'org-id',
      name: 'Test Farm',
      totalAcres: 100
    });

    expect(farm.name).toBe('Test Farm');
    expect(farm.totalAcres).toBe(100);
  });

  it('should throw error for negative acres', () => {
    expect(
      () =>
        new Farm({
          id: 'test-id',
          organizationId: 'org-id',
          name: 'Test Farm',
          totalAcres: -10
        })
    ).toThrow('Total acres must be a positive number');
  });
});
```

### Integration Tests

```typescript
// src/tests/application/use-cases/create-farm.use-case.test.ts
describe('CreateFarmUseCase', () => {
  let useCase: CreateFarmUseCase;
  let mockFarmRepo: jest.Mocked<FarmRepository>;
  let mockOrgRepo: jest.Mocked<OrganizationRepository>;

  beforeEach(() => {
    mockFarmRepo = createMockFarmRepository();
    mockOrgRepo = createMockOrganizationRepository();
    useCase = new CreateFarmUseCase(mockFarmRepo, mockOrgRepo);
  });

  it('should create farm successfully', async () => {
    // Setup mocks
    mockOrgRepo.getById.mockResolvedValue(mockOrganization);
    mockFarmRepo.findByOrganization.mockResolvedValue([]);
    mockFarmRepo.create.mockResolvedValue(mockFarm);

    // Execute
    const result = await useCase.execute({
      organizationId: 'org-1',
      name: 'New Farm'
    });

    // Assert
    expect(result.farm).toBeDefined();
    expect(mockFarmRepo.create).toHaveBeenCalled();
  });
});
```

### Run Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

## 🔐 Authentication Flow

### JWT Token Management

```typescript
// Infrastructure service
export class JwtService {
  generateAccessToken(user: User, organizationIds: string[]): string {
    const payload = {userId: user.id, organizationIds, type: 'access'};
    return jwt.sign(payload, this.accessSecret, {expiresIn: '15m'});
  }
}
```

### Two-Factor Authentication

```typescript
// Use case for enabling 2FA
export class EnableTwoFactorUseCase {
  async execute(request: EnableTwoFactorRequest) {
    // 1. Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: user.email,
      issuer: 'Farm Pilot'
    });

    // 2. Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // 3. Generate backup codes
    const backupCodes = this.generateBackupCodes();

    return {secret: secret.base32, qrCodeUrl, backupCodes};
  }
}
```

## 🎨 UI Component Development

### Creating New Components

```bash
touch src/components/ui/new-component.tsx
```

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

interface NewComponentProps {
  variant?: 'default' | 'primary';
  children: React.ReactNode;
}

export const NewComponent = React.forwardRef<
  HTMLDivElement,
  NewComponentProps
>(({ variant = 'default', children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'base-styles',
      variant === 'primary' && 'primary-styles',
      className
    )}
    {...props}
  >
    {children}
  </div>
))
```

### Using in Pages

```typescript
// src/routes/new-page.tsx
import { NewComponent } from '@/components/ui/new-component'

export function NewPage() {
  return (
    <div>
      <NewComponent variant="primary">
        Content here
      </NewComponent>
    </div>
  )
}
```

## 📊 Database Seeding

### Create Seed Script

```bash
touch prisma/seed.ts
```

```typescript
// prisma/seed.ts
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Farm Co',
      slug: 'demo-farm-co',
      subscriptionPlan: 'premium'
    }
  });

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'demo@farmpilot.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'Demo',
      lastName: 'User'
    }
  });

  // Add user to organization
  await prisma.organizationMember.create({
    data: {
      userId: user.id,
      organizationId: org.id,
      role: 'owner'
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Run Seed

```bash
npx tsx prisma/seed.ts
```

## 🚀 Deployment Checklist

### Environment Variables

```env
# Production .env
DATABASE_URL="postgresql://user:pass@host:5432/farmdb"
JWT_ACCESS_SECRET="strong-random-secret-256-bits"
JWT_REFRESH_SECRET="different-strong-random-secret"
NODE_ENV="production"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### Build and Deploy

```bash
# Build for production
npm run build

# Run database migrations
npm run db:migrate

# Start production server
npm start
```

### Health Checks

- Database connectivity
- JWT secret validation
- Environment variables check
- External service connectivity

## 🔍 Debugging Tips

### Common Issues

**1. Database Connection**

```bash
# Check database status
npm run db:studio

# Reset database
npm run db:push --force-reset
```

**2. TypeScript Errors**

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

**3. Prisma Issues**

```bash
# Regenerate Prisma client
npm run db:generate
```

### Development Tools

- **Prisma Studio**: Visual database editor
- **React DevTools**: Component debugging
- **Redux DevTools**: State debugging (if using Redux)
- **Network Tab**: API request debugging

## 📚 Additional Resources

- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing Guidelines

1. **Fork and Branch**: Create feature branches from `main`
2. **Code Style**: Follow ESLint and Prettier configuration
3. **Testing**: Add tests for new features
4. **Documentation**: Update README and JSDoc comments
5. **Pull Request**: Use descriptive titles and descriptions

---

Happy coding! 🌱 If you need help, check the main README or create an issue.
