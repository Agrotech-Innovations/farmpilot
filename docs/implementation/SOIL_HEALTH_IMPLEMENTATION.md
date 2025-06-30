# Soil Health Management Implementation Guide

## Overview

Farm Pilot includes a comprehensive soil health tracking system with a complete database schema already implemented in Prisma. However, the business logic layer (use cases and controllers) is missing and needs to be implemented to complete this feature.

## 📊 **Current Implementation Status**

### ✅ **Fully Implemented**

- **Database Schema**: Complete `SoilTest` model with all necessary fields
- **Repository Interface**: Defined in domain layer
- **Entity Model**: Basic soil test entity structure

### ❌ **Missing Implementation**

- **Use Cases**: No business logic implemented
- **Repository Implementation**: Prisma repository not implemented
- **API Controllers**: No server functions for soil management
- **UI Components**: No frontend components for soil tracking

## 🏗️ **Database Schema Analysis**

### **SoilTest Model** _(Already Implemented)_

```prisma
model SoilTest {
  id            String   @id @default(cuid())
  fieldId       String
  testDate      DateTime
  pH            Float?
  nitrogen      Float?
  phosphorus    Float?
  potassium     Float?
  organicMatter Float?
  soilType      String?
  notes         String?

  // Relationships
  field         Field    @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  amendments    SoilAmendment[]

  @@map("soil_tests")
}

model SoilAmendment {
  id          String   @id @default(cuid())
  soilTestId  String
  type        String   // 'fertilizer', 'lime', 'compost', 'other'
  product     String
  amount      Float
  unit        String   // 'lbs', 'tons', 'gallons'
  applicationDate DateTime
  cost        Float?
  notes       String?

  // Relationships
  soilTest    SoilTest @relation(fields: [soilTestId], references: [id], onDelete: Cascade)

  @@map("soil_amendments")
}
```

## 🎯 **Required Implementation**

### **1. Domain Entities** _(Needs Implementation)_

```typescript
// src/core/domain/entities/soil-test.entity.ts
export class SoilTest extends BaseEntity {
  constructor(
    public id: string,
    public fieldId: string,
    public testDate: Date,
    public pH?: number,
    public nitrogen?: number,
    public phosphorus?: number,
    public potassium?: number,
    public organicMatter?: number,
    public soilType?: string,
    public notes?: string,
    public amendments: SoilAmendment[] = [],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(createdAt, updatedAt);
    this.validateSoilTest();
  }

  private validateSoilTest(): void {
    if (!this.fieldId) {
      throw new Error('Field ID is required');
    }

    if (!this.testDate) {
      throw new Error('Test date is required');
    }

    // Validate pH range (typically 1-14)
    if (this.pH !== undefined && (this.pH < 1 || this.pH > 14)) {
      throw new Error('pH must be between 1 and 14');
    }

    // Validate nutrient percentages (0-100%)
    const nutrients = [
      this.nitrogen,
      this.phosphorus,
      this.potassium,
      this.organicMatter
    ];
    nutrients.forEach((nutrient, index) => {
      if (nutrient !== undefined && (nutrient < 0 || nutrient > 100)) {
        const names = ['nitrogen', 'phosphorus', 'potassium', 'organic matter'];
        throw new Error(`${names[index]} percentage must be between 0 and 100`);
      }
    });
  }

  // Business logic methods
  public getSoilHealthScore(): number {
    // Calculate overall soil health score based on test results
    let score = 0;
    let factors = 0;

    if (this.pH !== undefined) {
      // Optimal pH range is 6.0-7.0 for most crops
      const pHScore =
        this.pH >= 6.0 && this.pH <= 7.0
          ? 100
          : this.pH >= 5.5 && this.pH <= 7.5
            ? 80
            : this.pH >= 5.0 && this.pH <= 8.0
              ? 60
              : 40;
      score += pHScore;
      factors++;
    }

    if (this.nitrogen !== undefined) {
      // High nitrogen is generally good
      const nitrogenScore =
        this.nitrogen >= 3
          ? 100
          : this.nitrogen >= 2
            ? 80
            : this.nitrogen >= 1
              ? 60
              : 40;
      score += nitrogenScore;
      factors++;
    }

    if (this.organicMatter !== undefined) {
      // Higher organic matter is better
      const organicScore =
        this.organicMatter >= 5
          ? 100
          : this.organicMatter >= 3
            ? 80
            : this.organicMatter >= 2
              ? 60
              : 40;
      score += organicScore;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 0;
  }

  public getRecommendations(): SoilRecommendation[] {
    const recommendations: SoilRecommendation[] = [];

    if (this.pH !== undefined) {
      if (this.pH < 6.0) {
        recommendations.push({
          type: 'pH_adjustment',
          priority: 'high',
          description:
            'Soil is too acidic. Consider applying lime to raise pH.',
          suggestedAmendment: 'lime',
          estimatedAmount: this.calculateLimeRequirement()
        });
      } else if (this.pH > 7.5) {
        recommendations.push({
          type: 'pH_adjustment',
          priority: 'medium',
          description:
            'Soil is too alkaline. Consider applying sulfur to lower pH.',
          suggestedAmendment: 'sulfur',
          estimatedAmount: this.calculateSulfurRequirement()
        });
      }
    }

    if (this.nitrogen !== undefined && this.nitrogen < 2) {
      recommendations.push({
        type: 'nitrogen_deficiency',
        priority: 'high',
        description:
          'Low nitrogen levels. Consider applying nitrogen fertilizer.',
        suggestedAmendment: 'nitrogen_fertilizer',
        estimatedAmount: `${(3 - this.nitrogen) * 50} lbs per acre`
      });
    }

    if (this.organicMatter !== undefined && this.organicMatter < 3) {
      recommendations.push({
        type: 'organic_matter',
        priority: 'medium',
        description:
          'Low organic matter. Consider adding compost or cover crops.',
        suggestedAmendment: 'compost',
        estimatedAmount: '2-4 tons per acre'
      });
    }

    return recommendations;
  }

  private calculateLimeRequirement(): string {
    const pHDifference = 6.5 - (this.pH || 6.5);
    const limeRate = pHDifference * 1000; // Basic calculation
    return `${Math.round(limeRate)} lbs per acre`;
  }

  private calculateSulfurRequirement(): string {
    const pHDifference = (this.pH || 7.0) - 6.5;
    const sulfurRate = pHDifference * 200; // Basic calculation
    return `${Math.round(sulfurRate)} lbs per acre`;
  }
}

export class SoilAmendment extends BaseEntity {
  constructor(
    public id: string,
    public soilTestId: string,
    public type: AmendmentType,
    public product: string,
    public amount: number,
    public unit: string,
    public applicationDate: Date,
    public cost?: number,
    public notes?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(createdAt, updatedAt);
    this.validateAmendment();
  }

  private validateAmendment(): void {
    if (!this.soilTestId) {
      throw new Error('Soil test ID is required');
    }

    if (!this.product) {
      throw new Error('Product name is required');
    }

    if (this.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!this.unit) {
      throw new Error('Unit is required');
    }
  }
}

export type AmendmentType =
  | 'fertilizer'
  | 'lime'
  | 'compost'
  | 'sulfur'
  | 'other';

export interface SoilRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestedAmendment: string;
  estimatedAmount: string;
}
```

### **2. Repository Implementation** _(Needs Implementation)_

```typescript
// src/infrastructure/repositories/prisma-soil.repository.ts
export class PrismaSoilRepository implements SoilRepository {
  constructor(private prisma: PrismaClient) {}

  async save(soilTest: SoilTest): Promise<void> {
    await this.prisma.soilTest.upsert({
      where: {id: soilTest.id},
      update: {
        fieldId: soilTest.fieldId,
        testDate: soilTest.testDate,
        pH: soilTest.pH,
        nitrogen: soilTest.nitrogen,
        phosphorus: soilTest.phosphorus,
        potassium: soilTest.potassium,
        organicMatter: soilTest.organicMatter,
        soilType: soilTest.soilType,
        notes: soilTest.notes,
        updatedAt: new Date()
      },
      create: {
        id: soilTest.id,
        fieldId: soilTest.fieldId,
        testDate: soilTest.testDate,
        pH: soilTest.pH,
        nitrogen: soilTest.nitrogen,
        phosphorus: soilTest.phosphorus,
        potassium: soilTest.potassium,
        organicMatter: soilTest.organicMatter,
        soilType: soilTest.soilType,
        notes: soilTest.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async findById(id: string): Promise<SoilTest | null> {
    const data = await this.prisma.soilTest.findUnique({
      where: {id},
      include: {amendments: true}
    });

    return data ? this.toDomainEntity(data) : null;
  }

  async findByField(fieldId: string): Promise<SoilTest[]> {
    const data = await this.prisma.soilTest.findMany({
      where: {fieldId},
      include: {amendments: true},
      orderBy: {testDate: 'desc'}
    });

    return data.map(this.toDomainEntity);
  }

  async findByFarm(farmId: string): Promise<SoilTest[]> {
    const data = await this.prisma.soilTest.findMany({
      where: {
        field: {farmId}
      },
      include: {
        amendments: true,
        field: true
      },
      orderBy: {testDate: 'desc'}
    });

    return data.map(this.toDomainEntity);
  }

  async getLatestTestByField(fieldId: string): Promise<SoilTest | null> {
    const data = await this.prisma.soilTest.findFirst({
      where: {fieldId},
      include: {amendments: true},
      orderBy: {testDate: 'desc'}
    });

    return data ? this.toDomainEntity(data) : null;
  }

  async getSoilHealthTrends(
    fieldId: string,
    months: number = 12
  ): Promise<SoilHealthTrend[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const data = await this.prisma.soilTest.findMany({
      where: {
        fieldId,
        testDate: {gte: startDate}
      },
      orderBy: {testDate: 'asc'}
    });

    return data.map((test) => ({
      testDate: test.testDate,
      pH: test.pH,
      nitrogen: test.nitrogen,
      phosphorus: test.phosphorus,
      potassium: test.potassium,
      organicMatter: test.organicMatter,
      healthScore: this.calculateHealthScore(test)
    }));
  }

  private toDomainEntity(data: any): SoilTest {
    const amendments =
      data.amendments?.map(
        (amendment) =>
          new SoilAmendment(
            amendment.id,
            amendment.soilTestId,
            amendment.type,
            amendment.product,
            amendment.amount,
            amendment.unit,
            amendment.applicationDate,
            amendment.cost,
            amendment.notes,
            amendment.createdAt,
            amendment.updatedAt
          )
      ) || [];

    return new SoilTest(
      data.id,
      data.fieldId,
      data.testDate,
      data.pH,
      data.nitrogen,
      data.phosphorus,
      data.potassium,
      data.organicMatter,
      data.soilType,
      data.notes,
      amendments,
      data.createdAt,
      data.updatedAt
    );
  }

  private calculateHealthScore(test: any): number {
    // Reimplement the health score calculation
    let score = 0;
    let factors = 0;

    if (test.pH !== null) {
      const pHScore =
        test.pH >= 6.0 && test.pH <= 7.0
          ? 100
          : test.pH >= 5.5 && test.pH <= 7.5
            ? 80
            : test.pH >= 5.0 && test.pH <= 8.0
              ? 60
              : 40;
      score += pHScore;
      factors++;
    }

    if (test.nitrogen !== null) {
      const nitrogenScore =
        test.nitrogen >= 3
          ? 100
          : test.nitrogen >= 2
            ? 80
            : test.nitrogen >= 1
              ? 60
              : 40;
      score += nitrogenScore;
      factors++;
    }

    if (test.organicMatter !== null) {
      const organicScore =
        test.organicMatter >= 5
          ? 100
          : test.organicMatter >= 3
            ? 80
            : test.organicMatter >= 2
              ? 60
              : 40;
      score += organicScore;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 0;
  }
}

export interface SoilHealthTrend {
  testDate: Date;
  pH?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organicMatter?: number;
  healthScore: number;
}
```

### **3. Use Cases** _(Needs Implementation)_

```typescript
// src/core/application/use-cases/soil/create-soil-test.use-case.ts
export class CreateSoilTestUseCase {
  constructor(
    private soilRepository: SoilRepository,
    private fieldRepository: FieldRepository
  ) {}

  async execute(
    request: CreateSoilTestRequest
  ): Promise<CreateSoilTestResponse> {
    // Validate field exists and user has access
    const field = await this.fieldRepository.findById(request.fieldId);
    if (!field) {
      throw new Error('Field not found');
    }

    // Create soil test entity
    const soilTest = new SoilTest(
      this.generateId(),
      request.fieldId,
      request.testDate,
      request.pH,
      request.nitrogen,
      request.phosphorus,
      request.potassium,
      request.organicMatter,
      request.soilType,
      request.notes
    );

    // Save to repository
    await this.soilRepository.save(soilTest);

    // Generate recommendations
    const recommendations = soilTest.getRecommendations();
    const healthScore = soilTest.getSoilHealthScore();

    return {
      success: true,
      data: {
        soilTest: {
          id: soilTest.id,
          fieldId: soilTest.fieldId,
          testDate: soilTest.testDate,
          pH: soilTest.pH,
          nitrogen: soilTest.nitrogen,
          phosphorus: soilTest.phosphorus,
          potassium: soilTest.potassium,
          organicMatter: soilTest.organicMatter,
          soilType: soilTest.soilType,
          notes: soilTest.notes,
          healthScore,
          recommendations
        }
      }
    };
  }

  private generateId(): string {
    return `soil_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// src/core/application/use-cases/soil/get-soil-health-analytics.use-case.ts
export class GetSoilHealthAnalyticsUseCase {
  constructor(private soilRepository: SoilRepository) {}

  async execute(
    request: GetSoilHealthAnalyticsRequest
  ): Promise<GetSoilHealthAnalyticsResponse> {
    const soilTests = await this.soilRepository.findByFarm(request.farmId);

    if (soilTests.length === 0) {
      return {
        success: true,
        data: {
          totalTests: 0,
          averageHealthScore: 0,
          fieldSummaries: [],
          recentTests: [],
          recommendations: []
        }
      };
    }

    // Group tests by field
    const fieldGroups = soilTests.reduce(
      (groups, test) => {
        if (!groups[test.fieldId]) {
          groups[test.fieldId] = [];
        }
        groups[test.fieldId].push(test);
        return groups;
      },
      {} as Record<string, SoilTest[]>
    );

    // Calculate field summaries
    const fieldSummaries = Object.entries(fieldGroups).map(
      ([fieldId, tests]) => {
        const latestTest = tests[0]; // Already sorted by date desc
        const healthScore = latestTest.getSoilHealthScore();

        return {
          fieldId,
          latestTestDate: latestTest.testDate,
          healthScore,
          pH: latestTest.pH,
          organicMatter: latestTest.organicMatter,
          nitrogen: latestTest.nitrogen,
          testCount: tests.length
        };
      }
    );

    // Calculate overall metrics
    const totalTests = soilTests.length;
    const averageHealthScore = Math.round(
      fieldSummaries.reduce((sum, field) => sum + field.healthScore, 0) /
        fieldSummaries.length
    );

    // Get recent tests (last 5)
    const recentTests = soilTests.slice(0, 5).map((test) => ({
      id: test.id,
      fieldId: test.fieldId,
      testDate: test.testDate,
      healthScore: test.getSoilHealthScore(),
      pH: test.pH
    }));

    // Aggregate recommendations
    const allRecommendations = soilTests
      .slice(0, 10) // Latest 10 tests
      .flatMap((test) => test.getRecommendations())
      .reduce((unique, rec) => {
        const existing = unique.find((r) => r.type === rec.type);
        if (!existing) {
          unique.push(rec);
        }
        return unique;
      }, [] as SoilRecommendation[]);

    return {
      success: true,
      data: {
        totalTests,
        averageHealthScore,
        fieldSummaries,
        recentTests,
        recommendations: allRecommendations
      }
    };
  }
}

// src/core/application/use-cases/soil/record-soil-amendment.use-case.ts
export class RecordSoilAmendmentUseCase {
  constructor(private soilRepository: SoilRepository) {}

  async execute(
    request: RecordSoilAmendmentRequest
  ): Promise<RecordSoilAmendmentResponse> {
    // Find the soil test
    const soilTest = await this.soilRepository.findById(request.soilTestId);
    if (!soilTest) {
      throw new Error('Soil test not found');
    }

    // Create amendment
    const amendment = new SoilAmendment(
      this.generateId(),
      request.soilTestId,
      request.type,
      request.product,
      request.amount,
      request.unit,
      request.applicationDate,
      request.cost,
      request.notes
    );

    // Add amendment to soil test
    soilTest.amendments.push(amendment);

    // Save updated soil test
    await this.soilRepository.save(soilTest);

    return {
      success: true,
      data: {
        amendment: {
          id: amendment.id,
          type: amendment.type,
          product: amendment.product,
          amount: amendment.amount,
          unit: amendment.unit,
          applicationDate: amendment.applicationDate,
          cost: amendment.cost,
          notes: amendment.notes
        }
      }
    };
  }

  private generateId(): string {
    return `amendment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### **4. API Controllers** _(Needs Implementation)_

```typescript
// src/presentation/controllers/soil.controller.ts
import {createServerFn} from '@tanstack/start/server';
import {container} from '@/infrastructure/di/container';

export const createSoilTest = createServerFn({
  method: 'POST'
}).handler(async (data: CreateSoilTestRequest) => {
  const useCase = container.get<CreateSoilTestUseCase>('createSoilTestUseCase');
  return await useCase.execute(data);
});

export const getSoilHealthAnalytics = createServerFn({
  method: 'GET'
}).handler(async (data: {farmId: string}) => {
  const useCase = container.get<GetSoilHealthAnalyticsUseCase>(
    'getSoilHealthAnalyticsUseCase'
  );
  return await useCase.execute(data);
});

export const getSoilTests = createServerFn({
  method: 'GET'
}).handler(async (data: {fieldId?: string; farmId?: string}) => {
  const repository = container.get<SoilRepository>('soilRepository');

  if (data.fieldId) {
    const tests = await repository.findByField(data.fieldId);
    return {success: true, data: {tests}};
  }

  if (data.farmId) {
    const tests = await repository.findByFarm(data.farmId);
    return {success: true, data: {tests}};
  }

  throw new Error('Either fieldId or farmId must be provided');
});

export const recordSoilAmendment = createServerFn({
  method: 'POST'
}).handler(async (data: RecordSoilAmendmentRequest) => {
  const useCase = container.get<RecordSoilAmendmentUseCase>(
    'recordSoilAmendmentUseCase'
  );
  return await useCase.execute(data);
});

export const getSoilHealthTrends = createServerFn({
  method: 'GET'
}).handler(async (data: {fieldId: string; months?: number}) => {
  const repository = container.get<SoilRepository>('soilRepository');
  const trends = await repository.getSoilHealthTrends(
    data.fieldId,
    data.months
  );
  return {success: true, data: {trends}};
});
```

## 🎨 **UI Components** _(Needs Implementation)_

```typescript
// src/components/farm/features/soil/soil-health-dashboard.tsx
export function SoilHealthDashboard({ farmId }: { farmId: string }) {
  const { data: analytics } = useQuery({
    queryKey: ['soil-health-analytics', farmId],
    queryFn: () => getSoilHealthAnalytics({ farmId })
  });

  const { data: recentTests } = useQuery({
    queryKey: ['soil-tests', farmId],
    queryFn: () => getSoilTests({ farmId })
  });

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics?.data?.averageHealthScore || 0}
              </div>
              <p className="text-sm text-muted-foreground">Average Health Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics?.data?.totalTests || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics?.data?.fieldSummaries?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Fields Tested</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analytics?.data?.recommendations?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Summaries */}
      <Card>
        <CardHeader>
          <CardTitle>Field Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.data?.fieldSummaries?.map((field) => (
              <div key={field.fieldId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Field #{field.fieldId}</p>
                  <p className="text-sm text-muted-foreground">
                    Last tested: {new Date(field.latestTestDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    pH: {field.pH?.toFixed(1) || 'N/A'} |
                    Organic Matter: {field.organicMatter?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    field.healthScore >= 80 ? 'text-green-600' :
                    field.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {field.healthScore}
                  </div>
                  <p className="text-xs text-muted-foreground">Health Score</p>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-8">
                No soil tests recorded yet. Add your first soil test to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {analytics?.data?.recommendations && analytics.data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Soil Improvement Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.data.recommendations.map((rec, index) => (
                <Alert key={index} variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="capitalize">{rec.type.replace('_', ' ')} Issue</AlertTitle>
                  <AlertDescription>
                    {rec.description}
                    <br />
                    <span className="font-medium">Suggested: {rec.suggestedAmendment}</span>
                    {rec.estimatedAmount && <span> - {rec.estimatedAmount}</span>}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## 🎯 **Implementation Priority**

### **Phase 1: Core Functionality** _(High Priority)_

1. Implement domain entities with validation and business logic
2. Create Prisma repository implementation
3. Implement basic CRUD use cases
4. Add API controllers for soil test management

### **Phase 2: Analytics & Intelligence** _(Medium Priority)_

1. Implement soil health analytics use case
2. Add trend analysis capabilities
3. Create recommendation engine
4. Build comprehensive dashboard UI

### **Phase 3: Advanced Features** _(Future)_

1. Soil amendment tracking and cost analysis
2. Integration with crop planning for soil-based recommendations
3. Weather integration for optimal testing timing
4. Mobile app for field soil testing

This soil health management system will provide farmers with essential insights into their soil conditions, helping optimize crop yields and implement targeted soil improvement strategies.
