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
  mockCrops,
  mockFields,
  mockAnimals,
  mockHealthRecords,
  mockMetrics,
  mockActivities,
  mockAlerts,
  mockWeather,
  mockCropPerformance,
  mockTeamActivity,
  mockFinancialSummary,
  mockInventoryCategories,
  mockOperationalEquipment,
  mockMaintenanceEquipment,
  mockTasks,
  mockAnalyticsData
} from '@/data/dashboard-mock-data';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage
});

function DashboardPage() {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader
          onQuickAdd={handleQuickAdd}
          onSchedule={handleSchedule}
        />

        {/* Key Metrics */}
        <MetricsGrid metrics={mockMetrics} />

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
              categories={mockInventoryCategories}
              onCategoryClick={handleCategoryClick}
            />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManagement
              operational={mockOperationalEquipment}
              needsMaintenance={mockMaintenanceEquipment}
              onEquipmentClick={handleEquipmentClick}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement tasks={mockTasks} onTaskUpdate={handleTaskUpdate} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard data={mockAnalyticsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
