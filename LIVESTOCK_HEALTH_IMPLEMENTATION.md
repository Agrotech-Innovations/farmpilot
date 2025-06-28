# Livestock Health Tracking Implementation

## Overview

This document summarizes the implementation of livestock health tracking use cases following Clean Architecture principles.

## Implemented Use Cases

### 1. CreateHealthRecordUseCase

- **Purpose**: Creates new health records for animals (vaccinations, treatments, checkups, injuries, illnesses)
- **Location**: `src/core/application/use-cases/livestock/create-health-record.use-case.ts`
- **Features**:
  - Validates animal exists before creating record
  - Supports all health record types
  - Includes cost tracking and veterinarian information

### 2. GetHealthRecordsUseCase

- **Purpose**: Retrieves all health records for a specific animal
- **Location**: `src/core/application/use-cases/livestock/get-health-records.use-case.ts`
- **Features**:
  - Returns records sorted by creation date
  - Validates animal exists

### 3. UpdateAnimalHealthStatusUseCase

- **Purpose**: Updates an animal's health status with optional automatic health record creation
- **Location**: `src/core/application/use-cases/livestock/update-animal-health-status.use-case.ts`
- **Features**:
  - Updates health status (healthy, sick, injured, deceased)
  - Automatically creates health record when status changes to unhealthy with notes
  - Follows domain entity immutability patterns

### 4. ScheduleVaccinationUseCase

- **Purpose**: Schedules and records vaccinations for animals
- **Location**: `src/core/application/use-cases/livestock/schedule-vaccination.use-case.ts`
- **Features**:
  - Records vaccination type and description
  - Supports scheduled dates and cost tracking
  - Includes veterinarian information

### 5. GetLivestockHealthAnalyticsUseCase

- **Purpose**: Provides comprehensive health analytics for a farm
- **Location**: `src/core/application/use-cases/livestock/get-livestock-health-analytics.use-case.ts`
- **Features**:
  - Health statistics breakdown (healthy, sick, injured, deceased counts)
  - Health percentage calculations
  - Recent treatments and vaccination tracking
  - Cost analysis (total and per-animal averages)
  - Upcoming vaccination alerts
  - Recent health records summary

### 6. RecordTreatmentUseCase

- **Purpose**: Records treatments with optional health status updates
- **Location**: `src/core/application/use-cases/livestock/record-treatment.use-case.ts`
- **Features**:
  - Records treatment details, medications, and dosages
  - Optionally updates animal health status
  - Tracks treatment costs and veterinarian information

### 7. GetAnimalHealthHistoryUseCase

- **Purpose**: Provides complete health history for an individual animal
- **Location**: `src/core/application/use-cases/livestock/get-animal-health-history.use-case.ts`
- **Features**:
  - Filters by record type and date range
  - Provides summary statistics (vaccination count, treatment count, etc.)
  - Tracks last checkup, vaccination, and treatment dates
  - Calculates total health costs for the animal

### 8. UpdateAnimalWeightUseCase

- **Purpose**: Updates animal weight with optional health record creation
- **Location**: `src/core/application/use-cases/livestock/update-animal-weight.use-case.ts`
- **Features**:
  - Updates current weight
  - Optionally creates checkup record with weight change tracking
  - Calculates weight difference from previous weight

## Controller Integration

All use cases are integrated into the livestock controller (`src/presentation/controllers/livestock.controller.ts`) with the following endpoints:

- `createHealthRecord` - Creates health records
- `getHealthRecords` - Retrieves animal health records
- `updateAnimalHealth` - Updates health status
- `updateAnimalWeight` - Updates animal weight
- `getLivestockAnalytics` - Gets farm health analytics
- `scheduleVaccination` - Schedules vaccinations
- `recordTreatment` - Records treatments
- `getAnimalHealthHistory` - Gets individual animal history

## Dependency Injection

All use cases are registered in the DI container (`src/infrastructure/di/container.ts`) and can be accessed through:

- `createHealthRecordUseCase`
- `getHealthRecordsUseCase`
- `updateAnimalHealthStatusUseCase`
- `scheduleVaccinationUseCase`
- `getLivestockHealthAnalyticsUseCase`
- `recordTreatmentUseCase`
- `getAnimalHealthHistoryUseCase`
- `updateAnimalWeightUseCase`

## Key Features

### Clean Architecture Compliance

- **Domain Layer**: Pure business logic in entities and repositories
- **Application Layer**: Use cases orchestrate business logic
- **Infrastructure Layer**: Prisma repository implementations
- **Presentation Layer**: Controllers handle HTTP requests/responses

### Data Integrity

- Entity validation ensures data consistency
- Immutable entity patterns prevent accidental mutations
- Repository pattern abstracts data access

### Comprehensive Health Tracking

- Multiple record types (vaccination, treatment, checkup, injury, illness)
- Cost tracking for financial analysis
- Veterinarian information for professional oversight
- Date-based filtering and analytics

### Analytics and Reporting

- Farm-wide health statistics
- Individual animal health histories
- Cost analysis and trends
- Vaccination scheduling and reminders

## Usage Examples

### Creating a Health Record

```typescript
const healthRecord = await createHealthRecordUseCase.execute({
  animalId: 'animal-123',
  recordType: 'vaccination',
  description: 'Annual rabies vaccination',
  veterinarian: 'Dr. Smith',
  cost: 45.0,
  notes: 'No adverse reactions observed'
});
```

### Getting Health Analytics

```typescript
const analytics = await getLivestockHealthAnalyticsUseCase.execute({
  farmId: 'farm-456',
  daysAhead: 30
});
// Returns comprehensive health statistics and upcoming vaccinations
```

### Recording a Treatment

```typescript
const result = await recordTreatmentUseCase.execute({
  animalId: 'animal-789',
  description: 'Antibiotic treatment for infection',
  treatment: 'Penicillin injection',
  medication: 'Penicillin G',
  dosage: '2ml intramuscular',
  veterinarian: 'Dr. Johnson',
  cost: 25.0,
  updateHealthStatus: true,
  newHealthStatus: 'healthy'
});
```

This implementation provides a comprehensive livestock health tracking system that maintains data integrity, follows Clean Architecture principles, and offers extensive analytics capabilities for farm management.
