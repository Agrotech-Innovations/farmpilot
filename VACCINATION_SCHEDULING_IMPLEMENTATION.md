# Vaccination Scheduling Implementation

## Overview

This document details the comprehensive implementation of vaccination scheduling use cases for the Farm Pilot livestock management system, following Clean Architecture principles.

## Implemented Use Cases

### 1. ScheduleVaccinationUseCase (Existing)

- **Purpose**: Schedules individual vaccinations for animals
- **Location**: `src/core/application/use-cases/livestock/schedule-vaccination.use-case.ts`
- **Features**:
  - Records vaccination type and description
  - Supports scheduled dates and cost tracking
  - Includes veterinarian information
  - Creates health records for individual animals

### 2. CreateVaccinationScheduleUseCase (New)

- **Purpose**: Creates comprehensive vaccination schedules for multiple animals or groups
- **Location**: `src/core/application/use-cases/livestock/create-vaccination-schedule.use-case.ts`
- **Features**:
  - Schedule vaccinations for multiple animals or entire groups
  - Support for recurring vaccination schedules with interval days
  - Auto-scheduling of follow-up vaccinations
  - Batch processing for efficiency
  - Comprehensive validation and error handling

### 3. GetVaccinationScheduleUseCase (New)

- **Purpose**: Retrieves vaccination schedules with status tracking
- **Location**: `src/core/application/use-cases/livestock/get-vaccination-schedule.use-case.ts`
- **Features**:
  - Query by animal, group, or farm
  - Filter by vaccination type and date range
  - Status tracking (scheduled, completed, overdue)
  - Comprehensive analytics and statistics
  - Optional inclusion of completed vaccinations

### 4. UpdateVaccinationStatusUseCase (New)

- **Purpose**: Updates vaccination status when completed, rescheduled, or cancelled
- **Location**: `src/core/application/use-cases/livestock/update-vaccination-status.use-case.ts`
- **Features**:
  - Mark vaccinations as completed, rescheduled, or cancelled
  - Track actual costs and veterinarians
  - Add completion notes and reasons
  - Auto-schedule follow-up vaccinations
  - Maintain audit trail of status changes

### 5. GetVaccinationRemindersUseCase (New)

- **Purpose**: Provides vaccination reminders and alerts with priority management
- **Location**: `src/core/application/use-cases/livestock/get-vaccination-reminders.use-case.ts`
- **Features**:
  - Priority-based reminder system (high, medium, low)
  - Categorized reminders (upcoming, due soon, overdue)
  - Filter by vaccination type and priority level
  - Cost estimation and analytics
  - Smart priority calculation based on vaccination criticality

### 6. BulkScheduleVaccinationsUseCase (New)

- **Purpose**: Bulk scheduling of vaccinations with advanced filtering and batch processing
- **Location**: `src/core/application/use-cases/livestock/bulk-schedule-vaccinations.use-case.ts`
- **Features**:
  - Bulk operations across farms, groups, or specific animals
  - Advanced filtering by species, breed, age, and health status
  - Skip recently vaccinated animals to prevent over-vaccination
  - Comprehensive error handling and reporting
  - Detailed analytics and summary reporting

## Controller Integration

All vaccination scheduling use cases are integrated into the livestock controller (`src/presentation/controllers/livestock.controller.ts`) with the following endpoints:

### Existing Endpoints

- `scheduleVaccination` - Individual vaccination scheduling

### New Endpoints

- `createVaccinationSchedule` - Create comprehensive vaccination schedules
- `getVaccinationSchedule` - Retrieve vaccination schedules with status
- `updateVaccinationStatus` - Update vaccination completion status
- `getVaccinationReminders` - Get prioritized vaccination reminders
- `bulkScheduleVaccinations` - Bulk vaccination scheduling operations

## Dependency Injection

All vaccination scheduling use cases are registered in the DI container (`src/infrastructure/di/container.ts`):

- `scheduleVaccinationUseCase` (existing)
- `createVaccinationScheduleUseCase`
- `getVaccinationScheduleUseCase`
- `updateVaccinationStatusUseCase`
- `getVaccinationRemindersUseCase`
- `bulkScheduleVaccinationsUseCase`

## Key Features

### Clean Architecture Compliance

- **Domain Layer**: Pure business logic in entities and repositories
- **Application Layer**: Use cases orchestrate vaccination scheduling logic
- **Infrastructure Layer**: Prisma repository implementations
- **Presentation Layer**: Controllers handle HTTP requests/responses

### Advanced Scheduling Capabilities

- **Recurring Schedules**: Support for interval-based vaccination schedules
- **Auto-Scheduling**: Automatic scheduling of follow-up vaccinations
- **Bulk Operations**: Efficient processing of multiple animals
- **Smart Filtering**: Advanced criteria for target animal selection

### Comprehensive Status Management

- **Status Tracking**: Track vaccination status throughout lifecycle
- **Audit Trail**: Maintain complete history of status changes
- **Flexible Updates**: Support for completion, rescheduling, and cancellation

### Priority-Based Reminders

- **Smart Prioritization**: Automatic priority calculation based on:
  - Days until due/overdue
  - Vaccination criticality (rabies, core vaccines)
  - Animal health status
- **Categorized Alerts**: Upcoming, due soon, and overdue categories
- **Cost Tracking**: Estimated costs for budget planning

### Data Integrity and Validation

- **Entity Validation**: Ensures data consistency at domain level
- **Business Rules**: Prevents over-vaccination and scheduling conflicts
- **Error Handling**: Comprehensive error reporting and recovery

## Usage Examples

### Creating a Vaccination Schedule

```typescript
const scheduleResponse = await createVaccinationScheduleUseCase.execute({
  groupId: 'group-123',
  scheduleItems: [
    {
      vaccinationType: 'Rabies',
      description: 'Annual rabies vaccination',
      intervalDays: 365,
      initialDate: new Date('2024-03-15'),
      veterinarian: 'Dr. Smith',
      estimatedCost: 45.0,
      notes: 'Core vaccination - mandatory'
    }
  ],
  autoScheduleNext: true
});
```

### Getting Vaccination Reminders

```typescript
const reminders = await getVaccinationRemindersUseCase.execute({
  farmId: 'farm-456',
  daysAhead: 30,
  includeOverdue: true,
  priorityLevel: 'high'
});
// Returns high-priority vaccination reminders for the next 30 days
```

### Bulk Scheduling Vaccinations

```typescript
const bulkResult = await bulkScheduleVaccinationsUseCase.execute({
  farmId: 'farm-789',
  vaccinationSchedules: [
    {
      vaccinationType: 'BVDV',
      description: 'Bovine Viral Diarrhea Virus vaccination',
      scheduledDate: new Date('2024-04-01'),
      veterinarian: 'Dr. Johnson',
      estimatedCost: 35.0
    }
  ],
  filterCriteria: {
    species: 'cattle',
    ageMinDays: 180, // At least 6 months old
    healthStatus: ['healthy']
  },
  skipIfRecentlyVaccinated: true,
  recentVaccinationDays: 30
});
```

### Updating Vaccination Status

```typescript
const updateResult = await updateVaccinationStatusUseCase.execute({
  vaccinationRecordId: 'vaccination-123',
  status: 'completed',
  completedDate: new Date(),
  actualVeterinarian: 'Dr. Smith',
  actualCost: 45.0,
  completionNotes: 'No adverse reactions observed',
  scheduleNextVaccination: true,
  nextVaccinationIntervalDays: 365
});
```

## Benefits

### Operational Efficiency

- **Reduced Manual Work**: Automated scheduling and reminders
- **Batch Processing**: Handle multiple animals efficiently
- **Smart Filtering**: Target specific animal populations

### Compliance and Safety

- **Prevent Over-vaccination**: Skip recently vaccinated animals
- **Mandatory Tracking**: Ensure critical vaccinations are completed
- **Audit Trail**: Complete history for regulatory compliance

### Cost Management

- **Budget Planning**: Estimated costs for vaccination programs
- **Cost Tracking**: Actual vs. estimated cost analysis
- **Resource Optimization**: Efficient veterinarian scheduling

### Animal Health

- **Proactive Care**: Early reminders prevent missed vaccinations
- **Health Status Integration**: Consider animal health in scheduling
- **Comprehensive Tracking**: Complete vaccination history per animal

## Technical Implementation Notes

### Date Handling

- All dates are stored and processed in ISO format
- Timezone considerations for scheduling
- Flexible date parsing for user input

### Performance Optimization

- Parallel processing for bulk operations
- Efficient database queries with proper indexing
- Pagination support for large datasets

### Error Handling

- Comprehensive validation at all layers
- Graceful degradation for partial failures
- Detailed error reporting for troubleshooting

### Extensibility

- Plugin architecture for custom vaccination protocols
- Configurable reminder schedules
- Integration points for external veterinary systems

## Future Enhancements

### Planned Features

- **Integration with Veterinary Systems**: Direct scheduling with vet clinics
- **Mobile Notifications**: Push notifications for reminders
- **Regulatory Compliance**: Automatic reporting to authorities
- **AI-Powered Scheduling**: Optimize vaccination schedules using machine learning

### Scalability Considerations

- **Multi-tenant Support**: Isolation for different farms/organizations
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: Vaccination effectiveness tracking
- **Export Capabilities**: Integration with external reporting systems
