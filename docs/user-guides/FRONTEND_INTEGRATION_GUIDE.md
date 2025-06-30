# Frontend Integration Guide

## Overview

This guide provides comprehensive instructions for integrating the existing Farm Pilot frontend components with the production-ready backend APIs. While we have an enterprise-level backend with sophisticated livestock management, multi-tenant architecture, and 30+ endpoints, the frontend currently uses mock data throughout all components.

## 🎯 Current Situation

### What Works Perfectly ✅

- **Complete Backend API**: 30+ server functions with comprehensive validation and error handling
- **Advanced Livestock Management**: Enterprise-level vaccination, breeding, and health systems exceeding industry standards
- **Multi-Tenant Architecture**: Organization-based isolation with subscription limits and role-based access
- **Intelligent Alert Systems**: Production-ready inventory, equipment, and livestock alert systems
- **Beautiful UI Components**: Modern React components with Tailwind CSS, shadcn/ui, and proper TypeScript
- **Clean Architecture**: Well-structured codebase following Clean Architecture principles

### Critical Issues Requiring Immediate Attention 🚨

- **UI-Backend Disconnection**: All components use mock data instead of real server function calls
- **No State Management**: Missing TanStack Query for proper server state management
- **Unused Advanced Features**: Sophisticated vaccination scheduling, breeding management, and analytics systems not connected to UI
- **Missing Real-time Updates**: No live data synchronization from comprehensive backend systems
- **Alert System Disconnected**: Advanced alert use cases exist but UI components show static mock alerts

## 🚀 Quick Start

### 1. Install Required Dependencies

First, add state management for API calls:

```bash
npm install @tanstack/react-query
```

### 2. Set Up Query Client

Create `src/lib/query-client.ts`:

```typescript
import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});
```

Update your root component to provide the query client:

```typescript
// src/routes/__root.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

// Wrap your app with QueryClientProvider
<QueryClientProvider client={queryClient}>
  {/* Your existing app content */}
</QueryClientProvider>
```

## 📋 Step-by-Step Integration

### Step 1: Replace Dashboard Metrics

**Current**: `src/routes/dashboard/index.tsx` uses `mockMetrics`

**Target**: Connect to real farm data

```typescript
// Before
import { mockMetrics } from '@/data/dashboard-mock-data';

// After
import { useQuery } from '@tanstack/react-query';
import {
  listFarms,
  getLivestockAnalytics,
  getEquipmentAnalytics,
  getInventoryAnalytics
} from '@/presentation/controllers';

function DashboardPage() {
  const organizationId = "your-org-id"; // Get from auth context

  // Fetch real data
  const { data: farms } = useQuery({
    queryKey: ['farms', organizationId],
    queryFn: () => listFarms({ organizationId })
  });

  const { data: livestockData } = useQuery({
    queryKey: ['livestock-analytics', farms?.[0]?.id],
    queryFn: () => getLivestockAnalytics({ farmId: farms?.[0]?.id }),
    enabled: !!farms?.[0]?.id
  });

  // Calculate real metrics
  const metrics = [
    {
      title: 'Total Farms',
      value: farms?.data?.farms?.length || 0,
      subtitle: `${farms?.data?.farms?.length || 0} active farms`,
      icon: MapPin,
      colorClass: 'text-chart-1'
    },
    {
      title: 'Livestock',
      value: livestockData?.data?.totalAnimals || 0,
      subtitle: `${Math.round((livestockData?.data?.healthStats?.healthy / livestockData?.data?.totalAnimals) * 100) || 0}% healthy`,
      icon: Heart,
      colorClass: 'text-chart-4'
    }
    // Add more real metrics...
  ];

  return (
    <div>
      <MetricsGrid metrics={metrics} />
      {/* Rest of dashboard */}
    </div>
  );
}
```

### Step 2: Connect Advanced Livestock Dashboard

**Current**: `src/components/farm/features/livestock/livestock-health-dashboard.tsx` uses mock data

**Target**: Connect to sophisticated livestock management APIs

```typescript
// Before
const mockAnimals = [/* mock data */];

// After
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // Core livestock management
  listLivestockGroups,
  addLivestockAnimal,
  getLivestockHealthAnalytics,

  // Advanced vaccination system (6 use cases)
  getVaccinationReminders,
  scheduleVaccination,
  bulkScheduleVaccinations,
  createVaccinationSchedule,
  updateVaccinationStatus,
  getVaccinationSchedule,

  // Breeding management system (5 use cases)
  getBreedingRecords,
  createBreedingRecord,
  getBreedingAnalytics,
  updatePregnancyStatus,

  // Health management
  createHealthRecord,
  getHealthRecords,
  getAnimalHealthHistory,
  updateAnimalHealthStatus,
  recordTreatment
} from '@/presentation/controllers/livestock';

interface LivestockHealthDashboardProps {
  farmId: string;
}

export function LivestockHealthDashboard({ farmId }: LivestockHealthDashboardProps) {
  const queryClient = useQueryClient();

  // Core livestock data
  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['livestock-groups', farmId],
    queryFn: () => listLivestockGroups({ farmId })
  });

  // Advanced health analytics
  const { data: healthAnalytics } = useQuery({
    queryKey: ['livestock-health-analytics', farmId],
    queryFn: () => getLivestockHealthAnalytics({ farmId })
  });

  // Vaccination reminders with priority system
  const { data: vaccinationReminders } = useQuery({
    queryKey: ['vaccination-reminders', farmId],
    queryFn: () => getVaccinationReminders({
      farmId,
      daysAhead: 30,
      includeOverdue: true,
      priorityFilter: 'all' // 'high' | 'medium' | 'low' | 'all'
    })
  });

  // Breeding alerts and analytics
  const { data: breedingAnalytics } = useQuery({
    queryKey: ['breeding-analytics', farmId],
    queryFn: () => getBreedingAnalytics({ farmId })
  });

  // Health records for recent activity
  const { data: recentHealthRecords } = useQuery({
    queryKey: ['health-records', farmId],
    queryFn: () => getHealthRecords({
      farmId,
      limit: 10,
      sortBy: 'recordDate',
      order: 'desc'
    })
  });

  // Mutation for updating animal health status
  const updateHealthMutation = useMutation({
    mutationFn: updateAnimalHealthStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock-health-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
    }
  });

  if (groupsLoading) {
    return <div>Loading livestock data...</div>;
  }

  // Extract real statistics from analytics
  const stats = {
    total: healthAnalytics?.data?.totalAnimals || 0,
    healthy: healthAnalytics?.data?.healthStats?.healthy || 0,
    sick: healthAnalytics?.data?.healthStats?.sick || 0,
    injured: healthAnalytics?.data?.healthStats?.injured || 0,
    treatmentCost: healthAnalytics?.data?.treatmentCosts?.total || 0,
    vaccinationCompliance: healthAnalytics?.data?.vaccinationCompliance || 0
  };

  // Extract vaccination alerts by priority
  const vaccinationAlerts = {
    overdue: vaccinationReminders?.data?.overdueVaccinations || [],
    dueSoon: vaccinationReminders?.data?.dueSoonVaccinations || [],
    upcoming: vaccinationReminders?.data?.upcomingVaccinations || [],
    totalCost: vaccinationReminders?.data?.totalEstimatedCost || 0
  };

  // Extract breeding information
  const breedingInfo = {
    activePregnancies: breedingAnalytics?.data?.activePregnancies || 0,
    overduePregnancies: breedingAnalytics?.data?.overduePregnancies || [],
    expectedBirths: breedingAnalytics?.data?.expectedBirthsNextMonth || 0,
    successRate: breedingAnalytics?.data?.breedingSuccessRate || 0
  };

  return (
    <div className="space-y-6">
      {/* Real Health Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.healthy / stats.total) * 100)}% healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
            <p className="text-xs text-muted-foreground">
              {stats.sick} sick, {stats.injured} injured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccination Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {vaccinationAlerts.overdue.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {vaccinationAlerts.dueSoon.length} due soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breeding Status</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{breedingInfo.activePregnancies}</div>
            <p className="text-xs text-muted-foreground">
              {breedingInfo.expectedBirths} births expected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Reminders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccination Reminders</CardTitle>
          <CardDescription>
            Priority-based vaccination schedule with cost estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vaccinationAlerts.overdue.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Overdue Vaccinations</AlertTitle>
              <AlertDescription>
                {vaccinationAlerts.overdue.length} animals have overdue vaccinations requiring immediate attention.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {vaccinationAlerts.dueSoon.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Animal #{reminder.animalId}</p>
                  <p className="text-sm text-muted-foreground">{reminder.vaccinationType}</p>
                  <p className="text-xs text-muted-foreground">
                    Due in {reminder.daysUntilDue} days
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={reminder.priority === 'high' ? 'destructive' : 'secondary'}>
                    {reminder.priority}
                  </Badge>
                  {reminder.estimatedCost && (
                    <p className="text-sm text-muted-foreground">
                      ${reminder.estimatedCost}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {vaccinationAlerts.totalCost > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Total Estimated Cost: ${vaccinationAlerts.totalCost}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breeding Management Section */}
      {breedingInfo.activePregnancies > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breeding Management</CardTitle>
            <CardDescription>
              Active pregnancies and breeding analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{breedingInfo.activePregnancies}</div>
                <p className="text-sm text-muted-foreground">Active Pregnancies</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{breedingInfo.expectedBirths}</div>
                <p className="text-sm text-muted-foreground">Expected Births This Month</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(breedingInfo.successRate)}%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>

            {breedingInfo.overduePregnancies.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Overdue Pregnancies</AlertTitle>
                <AlertDescription>
                  {breedingInfo.overduePregnancies.length} animals are past their expected birth dates.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Health Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Activity</CardTitle>
          <CardDescription>
            Latest health records and treatments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentHealthRecords?.data?.healthRecords?.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Animal #{record.animalId}</p>
                  <p className="text-sm text-muted-foreground">{record.recordType}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(record.recordDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={record.recordType === 'illness' ? 'destructive' : 'secondary'}>
                    {record.recordType}
                  </Badge>
                  {record.cost && (
                    <p className="text-sm text-muted-foreground">${record.cost}</p>
                  )}
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground">No recent health records</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 3: Connect Inventory Management

**Current**: `src/components/farm/features/inventory/inventory-management.tsx` uses mock categories

**Target**: Connect to inventory APIs

```typescript
// Before
import { mockInventoryCategories } from '@/data/dashboard-mock-data';

// After
import { useQuery } from '@tanstack/react-query';
import {
  listInventoryItems,
  getInventoryAnalytics,
  getInventoryAlerts
} from '@/presentation/controllers/inventory';

interface InventoryManagementProps {
  farmId: string;
}

export function InventoryManagement({ farmId }: InventoryManagementProps) {
  const { data: itemsData } = useQuery({
    queryKey: ['inventory-items', farmId],
    queryFn: () => listInventoryItems({ farmId })
  });

  const { data: alertsData } = useQuery({
    queryKey: ['inventory-alerts', farmId],
    queryFn: () => getInventoryAlerts({ farmId })
  });

  // Group items by category
  const categories = itemsData?.data?.items?.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = { name: category, count: 0, status: 'Normal' };
    }
    acc[category].count++;
    return acc;
  }, {}) || {};

  // Add alert status
  Object.keys(categories).forEach(categoryName => {
    const categoryAlerts = alertsData?.data?.alerts?.filter(
      alert => alert.category === categoryName
    ) || [];

    if (categoryAlerts.length > 0) {
      categories[categoryName].status = `${categoryAlerts.length} alerts`;
      categories[categoryName].colorClass = 'text-destructive';
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Track seeds, fertilizers, feed, tools, and harvested produce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(categories).map((category, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onCategoryClick?.(category.name)}
              >
                <h3 className={`font-semibold ${category.colorClass || 'text-foreground'}`}>
                  {category.name}
                </h3>
                <p className="text-2xl font-bold">{category.count} items</p>
                <p className="text-sm text-muted-foreground">
                  {category.status}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 4: Connect Advanced Alert System

**Current**: `src/components/farm/overview/alerts-weather.tsx` displays mock alerts

**Target**: Connect to production-ready alert systems with real-time monitoring

```typescript
// Before
import { mockAlerts } from '@/data/dashboard-mock-data';

// After
import { useQuery } from '@tanstack/react-query';
import {
  // Inventory alert system (production-ready)
  getInventoryAlerts,

  // Equipment alert system (production-ready)
  getEquipmentAnalytics,

  // Livestock alert system (advanced implementation)
  getVaccinationReminders,
  getBreedingAnalytics,
  getLivestockHealthAnalytics
} from '@/presentation/controllers';

export function AlertsWeather({ farmId }: { farmId: string }) {
  // Fetch all alert types
  const { data: inventoryAlerts } = useQuery({
    queryKey: ['inventory-alerts', farmId],
    queryFn: () => getInventoryAlerts({
      farmId,
      expirationDaysAhead: 7
    })
  });

  const { data: equipmentAlerts } = useQuery({
    queryKey: ['equipment-alerts', farmId],
    queryFn: () => getEquipmentAnalytics({ farmId })
  });

  const { data: vaccinationAlerts } = useQuery({
    queryKey: ['vaccination-alerts', farmId],
    queryFn: () => getVaccinationReminders({
      farmId,
      daysAhead: 14,
      includeOverdue: true,
      priorityFilter: 'high' // Only show high priority
    })
  });

  const { data: breedingAlerts } = useQuery({
    queryKey: ['breeding-alerts', farmId],
    queryFn: () => getBreedingAnalytics({ farmId })
  });

  // Combine and prioritize all alerts
  const allAlerts = useMemo(() => {
    const alerts = [];

    // High priority: Overdue vaccinations
    vaccinationAlerts?.data?.overdueVaccinations?.forEach(vaccination => {
      alerts.push({
        id: `vaccination-${vaccination.id}`,
        type: 'health',
        severity: 'high',
        title: 'Overdue Vaccination',
        description: `Animal #${vaccination.animalId} - ${vaccination.vaccinationType}`,
        icon: AlertTriangle
      });
    });

    // High priority: Expired inventory
    inventoryAlerts?.data?.expiredItems?.forEach(item => {
      alerts.push({
        id: `inventory-expired-${item.id}`,
        type: 'inventory',
        severity: 'high',
        title: 'Expired Item',
        description: `${item.name} expired on ${new Date(item.expirationDate).toLocaleDateString()}`,
        icon: Package
      });
    });

    // Medium priority: Low stock
    inventoryAlerts?.data?.lowStockItems?.forEach(item => {
      alerts.push({
        id: `inventory-low-${item.id}`,
        type: 'inventory',
        severity: 'medium',
        title: 'Low Stock Alert',
        description: `${item.name} is running low (${item.currentQuantity} remaining)`,
        icon: Package
      });
    });

    // Medium priority: Equipment maintenance
    equipmentAlerts?.data?.needingMaintenance?.forEach(equipment => {
      alerts.push({
        id: `equipment-${equipment.id}`,
        type: 'equipment',
        severity: 'medium',
        title: 'Maintenance Due',
        description: `${equipment.name} requires maintenance`,
        icon: Wrench
      });
    });

    // High priority: Overdue pregnancies
    breedingAlerts?.data?.overduePregnancies?.forEach(pregnancy => {
      alerts.push({
        id: `breeding-${pregnancy.id}`,
        type: 'health',
        severity: 'high',
        title: 'Overdue Pregnancy',
        description: `Animal #${pregnancy.motherAnimalId} is ${pregnancy.daysOverdue} days overdue`,
        icon: AlertTriangle
      });
    });

    // Sort by severity (high first) and limit to 5 most important
    return alerts
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 5);
  }, [inventoryAlerts, equipmentAlerts, vaccinationAlerts, breedingAlerts]);

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-chart-5" />
          Farm Alerts
          {allAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {allAlerts.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time monitoring alerts from livestock, inventory, and equipment systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAlerts.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No active alerts. All systems operating normally.
            </p>
          </div>
        ) : (
          allAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              type={alert.type}
              title={alert.title}
              description={alert.description}
              icon={alert.icon}
              severity={alert.severity}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
```

## 🔧 Available Server Functions

### Authentication & Organization Management

```typescript
import {
  registerUser,
  loginUser,
  enableTwoFactor,
  oauthLogin
} from '@/presentation/controllers/auth';
```

### Farm Management

```typescript
import {createFarm, listFarms} from '@/presentation/controllers/farm';
```

### Advanced Livestock Management (15+ functions)

```typescript
import {
  // Core livestock management
  createLivestockGroup,
  addLivestockAnimal,
  updateAnimalWeight,
  getLivestockHealthAnalytics,

  // Health management system
  createHealthRecord,
  getHealthRecords,
  getAnimalHealthHistory,
  updateAnimalHealthStatus,
  recordTreatment,

  // Advanced vaccination system (6 use cases)
  scheduleVaccination,
  bulkScheduleVaccinations,
  createVaccinationSchedule,
  getVaccinationReminders,
  updateVaccinationStatus,
  getVaccinationSchedule,

  // Breeding management system (5 use cases)
  createBreedingRecord,
  getBreedingRecords,
  getBreedingAnalytics,
  updatePregnancyStatus,
  deleteBreedingRecord
} from '@/presentation/controllers/livestock';

// Import breeding controller for specialized breeding features
import {
  getBreedingAnalytics,
  createBreedingRecord,
  updatePregnancyStatus
} from '@/presentation/controllers/breeding';
```

### Equipment Management

```typescript
import {
  createEquipment,
  updateEquipment,
  scheduleMaintenance,
  getEquipmentAnalytics
} from '@/presentation/controllers/equipment';
```

### Inventory Management

```typescript
import {
  createInventoryItem,
  recordInventoryTransaction,
  getInventoryAnalytics,
  getInventoryAlerts
} from '@/presentation/controllers/inventory';
```

### Task Management

```typescript
import {
  createTask,
  updateTaskStatus,
  listTasks
} from '@/presentation/controllers/task';
```

## 🎨 UI Pattern Examples

### Loading States

```typescript
function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### Mutations (Create/Update)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateAnimalForm() {
  const queryClient = useQueryClient();

  const createAnimalMutation = useMutation({
    mutationFn: addLivestockAnimal,
    onSuccess: () => {
      // Invalidate and refetch livestock data
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['livestock-analytics'] });
    }
  });

  const handleSubmit = (formData) => {
    createAnimalMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button
        type="submit"
        disabled={createAnimalMutation.isPending}
      >
        {createAnimalMutation.isPending ? 'Creating...' : 'Create Animal'}
      </Button>
    </form>
  );
}
```

## 📊 Real-time Updates

For real-time features, you can use query invalidation:

```typescript
// After creating/updating data, invalidate related queries
queryClient.invalidateQueries({queryKey: ['livestock-analytics']});
queryClient.invalidateQueries({queryKey: ['vaccination-reminders']});
```

## 🔍 Error Handling

All server functions return a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Handle in components
const {data: response} = useQuery({
  queryKey: ['my-data'],
  queryFn: async () => {
    const result = await myServerFunction();
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  }
});
```

## 🚀 Implementation Priority

### Week 1: Core Dashboard

1. Replace dashboard metrics with real data
2. Connect farm selection
3. Add loading states

### Week 2: Livestock Integration

1. Connect livestock health dashboard
2. Wire up vaccination reminders
3. Implement animal creation forms

### Week 3: Inventory & Equipment

1. Connect inventory management
2. Wire up equipment tracking
3. Add alert systems

### Week 4: Tasks & Polish

1. Connect task management
2. Add error handling everywhere
3. Optimize performance

## 📝 Testing Integration

Test your integration:

```bash
# Start the development server
npm run dev

# In another terminal, test API endpoints
curl -X POST http://localhost:3000/api/createLivestockGroup \
  -H "Content-Type: application/json" \
  -d '{"farmId": "test", "name": "Test Group", "species": "cattle"}'
```

## 🎯 Success Metrics

You'll know the integration is successful when:

- ✅ Dashboard shows real farm data instead of static numbers
- ✅ Livestock dashboard displays actual animals from database
- ✅ Creating new records updates the UI immediately
- ✅ All loading states and error handling work properly
- ✅ No more mock data imports in components

## 🆘 Common Issues

### 1. Server Function Not Found

```typescript
// Make sure to import from the correct controller
import {createLivestockGroup} from '@/presentation/controllers/livestock';
```

### 2. Data Not Updating

```typescript
// Invalidate queries after mutations
queryClient.invalidateQueries({queryKey: ['livestock-groups']});
```

### 3. Type Errors

```typescript
// Server functions return ApiResponse<T>, access data property
const animals = response?.data?.groups || [];
```

---

This integration guide will help you connect the beautiful UI to the comprehensive backend that's already implemented. The backend is production-ready - we just need to wire it up!
