import {createFileRoute} from '@tanstack/react-router';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  DashboardHeader,
  MetricsGrid,
  RecentActivity,
  AlertsWeather,
  PerformanceSummary,
  InventoryManagement,
  EquipmentManagement,
  TaskManagement,
  AnalyticsDashboard,
  CropPlanningCalendar,
  LivestockHealthDashboard
} from '@/components/farm';
import {
  listFarms,
  listEquipment,
  getEquipmentAnalytics,
  listInventoryItems,
  getInventoryAlerts,
  getInventoryAnalytics,
  listTasks,
  getLivestockAnalytics
} from '@/presentation/controllers';
import {
  MapPin,
  Sprout,
  Heart,
  Tractor,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import {
  mockCrops,
  mockFields,
  mockAnimals,
  mockHealthRecords,
  mockActivities,
  mockAlerts,
  mockWeather,
  mockCropPerformance,
  mockTeamActivity,
  mockFinancialSummary,
  mockAnalyticsData
} from '@/data/dashboard-mock-data';

// Hard-coded IDs for demo purposes - in real app these would come from auth context
const DEMO_ORGANIZATION_ID = 'demo-org-id';
const DEMO_FARM_ID = 'demo-farm-id';

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
}

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface EquipmentAnalytics {
  totalEquipment: number;
  totalValue: number;
  equipmentByStatus: {
    operational: number;
    maintenance: number;
    broken: number;
    retired: number;
  };
  equipmentNeedingMaintenance: Equipment[];
  upcomingMaintenance: any[];
  maintenanceCosts: number;
  averageEquipmentAge: number;
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
  loader: async () => {
    try {
      // Note: These server functions need to be called differently
      // For now, returning mock data structure until proper implementation
      console.log('Loading dashboard data...');

      // Return mock data structure that matches expected shape
      return {
        farms: [],
        equipment: [] as Equipment[],
        equipmentAnalytics: null as EquipmentAnalytics | null,
        inventory: [] as InventoryItem[],
        inventoryAlerts: {
          lowStockItems: [],
          expiredItems: [],
          expiringSoonItems: []
        },
        inventoryAnalytics: {totalInventoryValue: 0},
        tasks: [] as Task[],
        taskStats: {},
        livestockAnalytics: {totalAnimals: 0, healthStats: {healthy: 0}}
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Return empty data structure on error
      return {
        farms: [],
        equipment: [] as Equipment[],
        equipmentAnalytics: null as EquipmentAnalytics | null,
        inventory: [] as InventoryItem[],
        inventoryAlerts: {
          lowStockItems: [],
          expiredItems: [],
          expiringSoonItems: []
        },
        inventoryAnalytics: {totalInventoryValue: 0},
        tasks: [] as Task[],
        taskStats: {},
        livestockAnalytics: {totalAnimals: 0, healthStats: {healthy: 0}}
      };
    }
  }
});

function DashboardPage() {
  const loaderData = Route.useLoaderData();

  // Calculate real metrics from loaded data
  const healthPercentage =
    loaderData.livestockAnalytics.totalAnimals > 0
      ? Math.round(
          (loaderData.livestockAnalytics.healthStats.healthy /
            loaderData.livestockAnalytics.totalAnimals) *
            100
        )
      : 0;

  const equipmentNeedingMaintenance =
    loaderData.equipmentAnalytics?.equipmentNeedingMaintenance?.length || 0;
  const lowStockCount = loaderData.inventoryAlerts.lowStockItems.length;
  const expiringSoonCount = loaderData.inventoryAlerts.expiringSoonItems.length;

  // Build metrics with real data where available
  const realMetrics = [
    {
      title: 'Total Farms',
      value: loaderData.farms.length,
      subtitle: `${loaderData.farms.length} ${loaderData.farms.length === 1 ? 'farm' : 'farms'} active`,
      icon: MapPin,
      colorClass: 'text-chart-1'
    },
    {
      title: 'Active Crops',
      value: 12, // Still using mock data as crop endpoints are not fully implemented
      subtitle: '8 ready for harvest',
      icon: Sprout,
      colorClass: 'text-chart-2'
    },
    {
      title: 'Livestock',
      value: loaderData.livestockAnalytics.totalAnimals,
      subtitle: `${healthPercentage}% healthy`,
      icon: Heart,
      colorClass: 'text-chart-4'
    },
    {
      title: 'Equipment',
      value: loaderData.equipment.length,
      subtitle: `${equipmentNeedingMaintenance} need maintenance`,
      icon: Tractor,
      colorClass: 'text-chart-5'
    },
    {
      title: 'Inventory',
      value: loaderData.inventory.length,
      subtitle: `${lowStockCount + expiringSoonCount} items need attention`,
      icon: Package,
      colorClass: 'text-chart-3'
    },
    {
      title: 'Inventory Value',
      value: `$${(loaderData.inventoryAnalytics.totalInventoryValue / 1000).toFixed(1)}K`,
      subtitle: 'Total inventory value',
      icon: DollarSign,
      colorClass: 'text-primary'
    }
  ];

  // Transform equipment data for EquipmentManagement component
  const operationalEquipment = loaderData.equipment
    .filter((eq: Equipment) => eq.status === 'operational')
    .map((eq: Equipment) => ({
      id: eq.id,
      name: eq.name,
      status: 'operational' as const
    }));

  const maintenanceEquipment = loaderData.equipment
    .filter(
      (eq: Equipment) => eq.status === 'maintenance' || eq.status === 'broken'
    )
    .map((eq: Equipment) => ({
      id: eq.id,
      name: eq.name,
      status: eq.status as 'maintenance' | 'broken'
    }));

  // Transform inventory data for InventoryManagement component
  const inventoryCategories = loaderData.inventory.reduce(
    (acc, item) => {
      const existing = acc.find((cat) => cat.name === item.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          name: item.category,
          count: 1,
          status: 'In stock', // Simplified status
          colorClass: 'text-chart-1' // Default color
        });
      }
      return acc;
    },
    [] as Array<{
      name: string;
      count: number;
      status: string;
      colorClass: string;
    }>
  );

  // Transform tasks data for TaskManagement component
  const transformedTasks = loaderData.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : 'No due date',
    status: task.status
  }));

  // Event handlers
  const handleQuickAdd = () => {
    console.log('Quick add clicked');
  };

  const handleSchedule = () => {
    console.log('Schedule clicked');
  };

  const handleCategoryClick = (category: string) => {
    console.log('Category clicked:', category);
  };

  const handleEquipmentClick = (id: string) => {
    console.log('Equipment clicked:', id);
  };

  const handleTaskUpdate = (taskId: string, status: string) => {
    console.log('Task update:', taskId, status);
    // TODO: Implement real task status update
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader
          onQuickAdd={handleQuickAdd}
          onSchedule={handleSchedule}
        />

        {/* Key Metrics - Now using real data where available */}
        <MetricsGrid metrics={realMetrics} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crops">Crop Planning</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentActivity activities={mockActivities} />
              <AlertsWeather alerts={mockAlerts} weather={mockWeather} />
            </div>

            <PerformanceSummary
              cropPerformance={mockCropPerformance}
              teamActivity={mockTeamActivity}
              financialSummary={mockFinancialSummary}
            />
          </TabsContent>

          <TabsContent value="crops">
            <CropPlanningCalendar
              crops={mockCrops}
              fields={mockFields}
              onUpdateCropPlan={(crop) => console.log('Update crop:', crop)}
              onCreateCropPlan={(fieldId, date) =>
                console.log('Create crop:', fieldId, date)
              }
            />
          </TabsContent>

          <TabsContent value="livestock">
            <LivestockHealthDashboard
              animals={mockAnimals}
              healthRecords={mockHealthRecords}
              onScheduleTreatment={(animalId) =>
                console.log('Schedule treatment:', animalId)
              }
              onUpdateHealth={(animalId, status) =>
                console.log('Update health:', animalId, status)
              }
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement
              categories={inventoryCategories}
              onCategoryClick={handleCategoryClick}
            />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManagement
              operational={operationalEquipment}
              needsMaintenance={maintenanceEquipment}
              onEquipmentClick={handleEquipmentClick}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement
              tasks={transformedTasks}
              onTaskUpdate={handleTaskUpdate}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard data={mockAnalyticsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
