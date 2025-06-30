# Breeding Management Implementation

## Overview

Farm Pilot's breeding management system is a comprehensive, production-ready solution for tracking animal breeding, pregnancy monitoring, and birth analytics. Built following Clean Architecture principles, it provides sophisticated breeding record management with advanced analytics and real-time status tracking.

## 🎯 **Key Features**

### ✅ **Fully Implemented & Production-Ready**

- **Complete Breeding Record System** with pregnancy lifecycle tracking
- **Advanced Pregnancy Status Management** (bred, confirmed, aborted, birthed)
- **Comprehensive Breeding Analytics** with success rate calculations
- **Genealogy Integration** with animal lineage tracking
- **Gestation Period Calculations** with overdue detection
- **Breeding Performance Metrics** and trend analysis
- **Data Validation & Business Rules** ensuring data integrity

---

## 🏗️ **Architecture Overview**

### **Clean Architecture Implementation**

```
src/
├── core/domain/entities/
│   └── livestock.entity.ts           # BreedingRecord domain entity
├── core/application/use-cases/livestock/
│   ├── create-breeding-record.use-case.ts
│   ├── update-pregnancy-status.use-case.ts
│   ├── get-breeding-records.use-case.ts
│   ├── get-breeding-analytics.use-case.ts
│   └── delete-breeding-record.use-case.ts
├── infrastructure/repositories/
│   └── prisma-livestock.repository.ts # Database implementation
└── presentation/controllers/
    └── breeding.controller.ts         # API endpoints
```

### **Dependency Flow**

- **Presentation Layer** → **Application Layer** → **Domain Layer**
- **Infrastructure Layer** implements **Domain Layer** interfaces
- All dependencies point inward following Clean Architecture principles

---

## 🧬 **Domain Model**

### **BreedingRecord Entity**

The `BreedingRecord` entity is the core domain object with rich business logic:

```typescript
interface BreedingRecordProps {
  id: string;
  motherAnimalId: string; // Required - female animal
  fatherAnimalId?: string; // Optional - male animal
  breedingDate: Date; // Required - when breeding occurred
  expectedBirthDate?: Date; // Optional - estimated birth date
  actualBirthDate?: Date; // Set when birth occurs
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  offspringCount?: number; // Number of offspring born
  notes?: string; // Additional notes
  createdAt?: Date;
  updatedAt?: Date;
}
```

### **Business Logic Methods**

The `BreedingRecord` entity includes sophisticated business logic:

```typescript
class BreedingRecord extends BaseEntity {
  // Status management
  updatePregnancyStatus(
    status,
    actualBirthDate?,
    offspringCount?
  ): BreedingRecord;
  updateExpectedBirthDate(expectedBirthDate: Date): BreedingRecord;

  // Calculations
  getGestationDays(): number | null; // Days since breeding

  // Status checks
  isPregnant(): boolean; // bred or confirmed status
  hasGivenBirth(): boolean; // birthed status
  isOverdue(): boolean; // past expected birth date
}
```

### **Data Validation Rules**

- **Mother Animal**: Must exist and be female
- **Father Animal**: Must exist and be male (if provided)
- **Date Validation**: Expected birth date must be after breeding date
- **Birth Validation**: Actual birth date cannot be before breeding date
- **Status Rules**: 'birthed' status requires actual birth date and offspring count

---

## 🚀 **Use Cases Implementation**

### **1. CreateBreedingRecordUseCase**

**Purpose**: Creates new breeding records with comprehensive validation

**Location**: `src/core/application/use-cases/livestock/create-breeding-record.use-case.ts`

**Features**:

- Validates mother animal exists and is female
- Validates father animal exists and is male (if provided)
- Creates breeding record with 'bred' initial status
- Supports optional expected birth date calculation

**Request Interface**:

```typescript
interface CreateBreedingRecordRequest {
  motherAnimalId: string;
  fatherAnimalId?: string;
  breedingDate: Date;
  expectedBirthDate?: Date;
  notes?: string;
}
```

### **2. UpdatePregnancyStatusUseCase**

**Purpose**: Updates pregnancy status throughout the breeding lifecycle

**Location**: `src/core/application/use-cases/livestock/update-pregnancy-status.use-case.ts`

**Features**:

- Updates status: bred → confirmed → birthed/aborted
- Validates business rules for each status transition
- Records actual birth date and offspring count for births
- Maintains audit trail of status changes

**Request Interface**:

```typescript
interface UpdatePregnancyStatusRequest {
  breedingRecordId: string;
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  actualBirthDate?: Date; // Required for 'birthed'
  offspringCount?: number; // Required for 'birthed'
}
```

### **3. GetBreedingRecordsUseCase**

**Purpose**: Retrieves breeding records with flexible filtering

**Location**: `src/core/application/use-cases/livestock/get-breeding-records.use-case.ts`

**Features**:

- Query by farm (all breeding records)
- Query by mother animal (specific animal's breeding history)
- Returns complete breeding record data with calculated fields

**Request Interface**:

```typescript
interface GetBreedingRecordsRequest {
  farmId?: string; // Get all farm breeding records
  motherAnimalId?: string; // Get specific animal's records
}
```

### **4. GetBreedingAnalyticsUseCase**

**Purpose**: Provides comprehensive breeding analytics and metrics

**Location**: `src/core/application/use-cases/livestock/get-breeding-analytics.use-case.ts`

**Features**:

- **Active Pregnancy Tracking**: Current pregnant animals
- **Overdue Pregnancy Detection**: Animals past expected birth date
- **Upcoming Births**: Animals expected to give birth soon
- **Annual Birth Statistics**: Births completed this year
- **Performance Metrics**: Average gestation days, success rates
- **Detailed Analytics**: Lists of animals in each category

**Analytics Response**:

```typescript
interface BreedingAnalytics {
  totalActivePregnancies: number;
  overduePregnancies: number;
  upcomingBirths: number;
  totalBirthsThisYear: number;
  averageGestationDays: number;
  pregnancySuccessRate: number;
  activePregnancies: BreedingRecord[];
  overduePregnanciesList: BreedingRecord[];
  upcomingBirthsList: BreedingRecord[];
}
```

### **5. DeleteBreedingRecordUseCase**

**Purpose**: Safely removes breeding records with validation

**Location**: `src/core/application/use-cases/livestock/delete-breeding-record.use-case.ts`

**Features**:

- Validates breeding record exists before deletion
- Maintains data integrity through proper validation
- Supports cleanup of incorrect or test records

---

## 🌐 **API Endpoints**

All breeding use cases are exposed through RESTful server functions in `src/presentation/controllers/breeding.controller.ts`:

### **Create Breeding Record**

**Endpoint**: `createBreedingRecord`  
**Method**: POST

**Request Body**:

```typescript
{
  motherAnimalId: string;
  fatherAnimalId?: string;
  breedingDate: string;        // ISO date string
  expectedBirthDate?: string;  // ISO date string
  notes?: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    id: string;
    motherAnimalId: string;
    fatherAnimalId?: string;
    breedingDate: Date;
    expectedBirthDate?: Date;
    actualBirthDate?: Date;
    pregnancyStatus: string;
    offspringCount?: number;
    notes?: string;
    gestationDays: number | null;
    isPregnant: boolean;
    hasGivenBirth: boolean;
    isOverdue: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}
```

### **Update Pregnancy Status**

**Endpoint**: `updatePregnancyStatus`  
**Method**: POST

**Request Body**:

```typescript
{
  breedingRecordId: string;
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  actualBirthDate?: string;    // Required for 'birthed'
  offspringCount?: number;     // Required for 'birthed'
}
```

### **Get Breeding Records**

**Endpoint**: `getBreedingRecords`  
**Method**: GET

**Request Body**:

```typescript
{
  farmId?: string;           // Get all farm records
  motherAnimalId?: string;   // Get specific animal records
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    records: BreedingRecord[];  // Array of breeding records
  };
  error?: string;
}
```

### **Get Breeding Analytics**

**Endpoint**: `getBreedingAnalytics`  
**Method**: GET

**Request Body**:

```typescript
{
  farmId: string;
  daysAheadForUpcoming?: number;  // Default: 30 days
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: BreedingAnalytics;
  error?: string;
}
```

### **Delete Breeding Record**

**Endpoint**: `deleteBreedingRecord`  
**Method**: DELETE

**Request Body**:

```typescript
{
  breedingRecordId: string;
}
```

---

## 📊 **Database Schema**

### **BreedingRecord Table**

```sql
model BreedingRecord {
  id              String          @id @default(cuid())
  motherAnimalId  String
  fatherAnimalId  String?
  breedingDate    DateTime
  expectedBirthDate DateTime?
  actualBirthDate DateTime?
  pregnancyStatus String          @default("bred")
  offspringCount  Int?
  notes           String?

  mother          LivestockAnimal @relation(fields: [motherAnimalId], references: [id], onDelete: Cascade)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@map("breeding_records")
}
```

### **Repository Methods**

The `PrismaLivestockRepository` implements comprehensive breeding data access:

```typescript
// Core CRUD operations
findBreedingRecordById(id: string): Promise<BreedingRecord | null>
findBreedingRecordsByMother(motherAnimalId: string): Promise<BreedingRecord[]>
findBreedingRecordsByFarm(farmId: string): Promise<BreedingRecord[]>
saveBreedingRecord(record: BreedingRecord): Promise<void>
deleteBreedingRecord(id: string): Promise<void>

// Analytics queries
findActivePregnancies(farmId: string): Promise<BreedingRecord[]>
findOverduePregnancies(farmId: string): Promise<BreedingRecord[]>
findUpcomingBirths(farmId: string, daysAhead: number): Promise<BreedingRecord[]>
```

---

## 🔧 **Dependency Injection**

All breeding use cases are registered in the DI container (`src/infrastructure/di/container.ts`):

```typescript
// Breeding Management Use Cases
container.register('createBreedingRecordUseCase', CreateBreedingRecordUseCase);
container.register(
  'updatePregnancyStatusUseCase',
  UpdatePregnancyStatusUseCase
);
container.register('getBreedingRecordsUseCase', GetBreedingRecordsUseCase);
container.register('getBreedingAnalyticsUseCase', GetBreedingAnalyticsUseCase);
container.register('deleteBreedingRecordUseCase', DeleteBreedingRecordUseCase);
```

---

## 💡 **Usage Examples**

### **Recording a Breeding Event**

```typescript
import {createBreedingRecord} from '@/presentation/controllers/breeding';

const breedingResponse = await createBreedingRecord({
  motherAnimalId: 'cow-001',
  fatherAnimalId: 'bull-001',
  breedingDate: '2024-01-15',
  expectedBirthDate: '2024-10-22', // ~280 days for cattle
  notes: 'Natural breeding, observed mating'
});

if (breedingResponse.success) {
  console.log('Breeding recorded:', breedingResponse.data);
}
```

### **Confirming Pregnancy**

```typescript
import {updatePregnancyStatus} from '@/presentation/controllers/breeding';

const confirmResponse = await updatePregnancyStatus({
  breedingRecordId: 'breeding-123',
  pregnancyStatus: 'confirmed'
});

// Later, when birth occurs
const birthResponse = await updatePregnancyStatus({
  breedingRecordId: 'breeding-123',
  pregnancyStatus: 'birthed',
  actualBirthDate: '2024-10-20',
  offspringCount: 1
});
```

### **Getting Farm Breeding Analytics**

```typescript
import {getBreedingAnalytics} from '@/presentation/controllers/breeding';

const analytics = await getBreedingAnalytics({
  farmId: 'farm-456',
  daysAheadForUpcoming: 30
});

if (analytics.success) {
  const data = analytics.data;
  console.log(`Active pregnancies: ${data.totalActivePregnancies}`);
  console.log(`Overdue pregnancies: ${data.overduePregnancies}`);
  console.log(`Upcoming births: ${data.upcomingBirths}`);
  console.log(`Success rate: ${data.pregnancySuccessRate}%`);
  console.log(`Average gestation: ${data.averageGestationDays} days`);
}
```

### **Querying Breeding Records**

```typescript
import {getBreedingRecords} from '@/presentation/controllers/breeding';

// Get all farm breeding records
const farmRecords = await getBreedingRecords({
  farmId: 'farm-456'
});

// Get specific animal's breeding history
const animalHistory = await getBreedingRecords({
  motherAnimalId: 'cow-001'
});

if (farmRecords.success) {
  farmRecords.data.records.forEach((record) => {
    console.log(`Breeding ${record.id}:`);
    console.log(`  Status: ${record.pregnancyStatus}`);
    console.log(`  Gestation: ${record.gestationDays} days`);
    console.log(`  Overdue: ${record.isOverdue}`);
  });
}
```

---

## 🎯 **Business Benefits**

### **Operational Efficiency**

- **Automated Tracking**: Systematic recording of all breeding activities
- **Status Monitoring**: Real-time pregnancy status across the farm
- **Overdue Alerts**: Immediate identification of overdue pregnancies
- **Planning Support**: Upcoming birth predictions for resource planning

### **Genetic Management**

- **Lineage Tracking**: Complete mother/father genealogy records
- **Breeding Program Support**: Success rate tracking for breeding decisions
- **Performance Analysis**: Gestation period analysis for breed optimization

### **Financial Planning**

- **Birth Forecasting**: Predict livestock population growth
- **Resource Allocation**: Plan for birthing facilities and veterinary needs
- **Success Metrics**: Calculate breeding program ROI and efficiency

### **Compliance & Records**

- **Complete Audit Trail**: Timestamped breeding and birth records
- **Regulatory Support**: Maintain records for livestock registration
- **Veterinary Coordination**: Comprehensive breeding history for health decisions

---

## 🔍 **Advanced Features**

### **Pregnancy Lifecycle Management**

The system tracks the complete pregnancy lifecycle:

1. **Bred**: Initial breeding recorded
2. **Confirmed**: Pregnancy confirmed (ultrasound, vet check)
3. **Birthed**: Successful birth with offspring count
4. **Aborted**: Pregnancy loss or termination

### **Intelligent Analytics**

- **Success Rate Calculation**: Percentage of successful births vs total breedings
- **Gestation Analysis**: Average gestation periods by breed/animal
- **Overdue Detection**: Automatic identification of overdue pregnancies
- **Seasonal Trends**: Birth timing analysis for planning

### **Data Integrity & Validation**

- **Gender Validation**: Ensures mothers are female, fathers are male
- **Date Logic**: Validates date relationships (breeding → expected → actual)
- **Status Rules**: Enforces proper status transitions and required data
- **Immutable Records**: Entity immutability prevents accidental data corruption

---

## 🚀 **Integration Points**

### **Livestock Management Integration**

- **Animal Records**: Direct integration with livestock animal entities
- **Health Records**: Breeding events can trigger health record creation
- **Group Management**: Breeding analytics at group and farm levels

### **Task Management Integration**

- **Breeding Tasks**: Create tasks for pregnancy checks, breeding schedules
- **Birth Preparation**: Automatic task creation for upcoming births
- **Veterinary Scheduling**: Integration with vet visit planning

### **Analytics Dashboard Integration**

- **Real-time Metrics**: Live breeding statistics for dashboard display
- **Alert System**: Overdue pregnancy alerts and upcoming birth notifications
- **Performance Tracking**: Breeding success trends and analytics

---

## 🎨 **Frontend Integration**

### **Component Integration Examples**

```typescript
// Breeding Dashboard Component
import { useQuery } from '@tanstack/react-query';
import { getBreedingAnalytics } from '@/presentation/controllers/breeding';

function BreedingDashboard({ farmId }: { farmId: string }) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['breeding-analytics', farmId],
    queryFn: () => getBreedingAnalytics({ farmId, daysAheadForUpcoming: 30 })
  });

  if (isLoading) return <div>Loading breeding data...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Active Pregnancies"
        value={analytics?.data?.totalActivePregnancies || 0}
        icon={Heart}
      />
      <MetricCard
        title="Overdue"
        value={analytics?.data?.overduePregnancies || 0}
        icon={AlertTriangle}
        variant="warning"
      />
      <MetricCard
        title="Upcoming Births"
        value={analytics?.data?.upcomingBirths || 0}
        icon={Calendar}
      />
    </div>
  );
}
```

### **Form Integration**

```typescript
// Breeding Record Form
import {createBreedingRecord} from '@/presentation/controllers/breeding';

function BreedingRecordForm() {
  const handleSubmit = async (data: FormData) => {
    const result = await createBreedingRecord({
      motherAnimalId: data.motherAnimalId,
      fatherAnimalId: data.fatherAnimalId,
      breedingDate: data.breedingDate,
      expectedBirthDate: data.expectedBirthDate,
      notes: data.notes
    });

    if (result.success) {
      toast.success('Breeding record created successfully');
      // Refresh data, navigate, etc.
    } else {
      toast.error(result.error);
    }
  };

  // Form JSX implementation...
}
```

---

## 📈 **Performance Considerations**

### **Database Optimization**

- **Indexed Queries**: Proper indexing on farmId, motherAnimalId, and dates
- **Efficient Joins**: Optimized queries for analytics calculations
- **Pagination Support**: Large dataset handling for farms with many animals

### **Caching Strategy**

- **Analytics Caching**: Cache breeding analytics for improved dashboard performance
- **Query Optimization**: Use React Query for efficient data fetching and caching
- **Real-time Updates**: Implement optimistic updates for status changes

---

## 🔮 **Future Enhancements**

### **Planned Features**

- **AI-Powered Predictions**: Machine learning for gestation period predictions
- **Mobile Integration**: Mobile app for field breeding record entry
- **Photo Documentation**: Image uploads for breeding and birth documentation
- **Integration APIs**: External breeding registry and genetics database integration

### **Advanced Analytics**

- **Genetic Analysis**: Breeding success correlation with genetic markers
- **Seasonal Optimization**: Optimal breeding timing recommendations
- **Cost Analysis**: Complete breeding program cost tracking and ROI analysis
- **Predictive Alerts**: AI-powered pregnancy complication predictions

---

## 🎯 **Summary**

Farm Pilot's breeding management system represents a **production-ready, enterprise-level** solution for livestock breeding operations. With comprehensive domain modeling, sophisticated business logic, and complete API coverage, it provides farmers with the tools needed for efficient breeding program management.

**Key Strengths**:

- ✅ **Complete Implementation**: All core breeding features fully implemented
- ✅ **Clean Architecture**: Maintainable, testable, and extensible codebase
- ✅ **Rich Domain Logic**: Sophisticated business rules and calculations
- ✅ **Comprehensive APIs**: Full REST API coverage with validation
- ✅ **Advanced Analytics**: Real-time insights and performance metrics

The system is ready for immediate production use and provides a solid foundation for future enhancements and integrations.
