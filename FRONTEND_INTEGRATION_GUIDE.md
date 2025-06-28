# Frontend Integration Guide

## Overview

This guide provides step-by-step instructions for connecting the existing UI components to the comprehensive backend API that's already implemented. The backend has 30+ server functions ready to use - we just need to wire them up to the frontend.

## 🎯 Current Situation

- ✅ **Backend**: 30+ API endpoints with comprehensive business logic
- ✅ **UI Components**: Beautiful, functional components with proper interfaces
- ❌ **Connection**: UI uses mock data instead of real APIs

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

### Step 2: Connect Livestock Dashboard

**Current**: `src/components/farm/features/livestock/livestock-health-dashboard.tsx` uses mock data

**Target**: Connect to livestock APIs

```typescript
// Before
const mockAnimals = [/* mock data */];

// After
import { useQuery } from '@tanstack/react-query';
import {
  listLivestockGroups,
  listLivestockAnimals,
  getLivestockAnalytics,
  getVaccinationReminders
} from '@/presentation/controllers/livestock';

interface LivestockHealthDashboardProps {
  farmId: string;
}

export function LivestockHealthDashboard({ farmId }: LivestockHealthDashboardProps) {
  // Fetch real livestock data
  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['livestock-groups', farmId],
    queryFn: () => listLivestockGroups({ farmId })
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['livestock-analytics', farmId],
    queryFn: () => getLivestockAnalytics({ farmId })
  });

  const { data: remindersData } = useQuery({
    queryKey: ['vaccination-reminders', farmId],
    queryFn: () => getVaccinationReminders({
      farmId,
      daysAhead: 30,
      includeOverdue: true
    })
  });

  if (groupsLoading) {
    return <div>Loading livestock data...</div>;
  }

  const animals = groupsData?.data?.groups?.flatMap(group =>
    group.animals || []
  ) || [];

  const stats = {
    total: analyticsData?.data?.totalAnimals || 0,
    healthy: analyticsData?.data?.healthStats?.healthy || 0,
    sick: analyticsData?.data?.healthStats?.sick || 0,
    injured: analyticsData?.data?.healthStats?.injured || 0
  };

  return (
    <div className="space-y-6">
      {/* Use real stats instead of mock data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total animals</p>
          </CardContent>
        </Card>
        {/* More real metrics... */}
      </div>
      {/* Rest of component using real data */}
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

## 🔧 Available Server Functions

### Authentication

```typescript
import {
  registerUser,
  loginUser,
  enableTwoFactor
} from '@/presentation/controllers/auth';
```

### Farm Management

```typescript
import {createFarm, listFarms} from '@/presentation/controllers/farm';
```

### Livestock Management (10+ functions)

```typescript
import {
  createLivestockGroup,
  addLivestockAnimal,
  createHealthRecord,
  updateAnimalHealth,
  getLivestockAnalytics,
  scheduleVaccination,
  createVaccinationSchedule,
  getVaccinationReminders
} from '@/presentation/controllers/livestock';
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
