import {createFileRoute} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart3,
  Sprout,
  Tractor,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Users,
  Plus,
  Package,
  Heart,
  DollarSign,
  Activity
} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {CropPlanningCalendar} from '@/components/farm/crop-planning-calendar';
import {LivestockHealthDashboard} from '@/components/farm/livestock-health-dashboard';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage
});

function DashboardPage() {
  // Mock data - in real app this would come from server functions
  const mockCrops = [
    {
      id: '1',
      cropName: 'Corn',
      variety: 'Sweet Corn',
      fieldName: 'North Field',
      plantingDate: new Date('2024-04-15'),
      expectedHarvestDate: new Date('2024-08-15'),
      status: 'growing' as const,
      acres: 25
    },
    {
      id: '2',
      cropName: 'Tomatoes',
      variety: 'Roma',
      fieldName: 'East Field',
      plantingDate: new Date('2024-05-01'),
      expectedHarvestDate: new Date('2024-07-15'),
      status: 'planted' as const,
      acres: 10
    }
  ];

  const mockFields = [
    {id: '1', name: 'North Field', acres: 25, soilType: 'Loam'},
    {id: '2', name: 'East Field', acres: 15, soilType: 'Clay'},
    {id: '3', name: 'South Field', acres: 20, soilType: 'Sandy'}
  ];

  const mockAnimals = [
    {
      id: '1',
      tagNumber: 'C001',
      name: 'Bessie',
      species: 'Cattle',
      breed: 'Holstein',
      age: 3,
      healthStatus: 'healthy' as const,
      lastCheckup: new Date('2024-01-01'),
      nextVaccination: new Date('2024-02-15'),
      weight: 1200
    },
    {
      id: '2',
      tagNumber: 'C002',
      species: 'Cattle',
      breed: 'Angus',
      age: 2,
      healthStatus: 'sick' as const,
      lastCheckup: new Date('2024-01-10'),
      weight: 950
    }
  ];

  const mockHealthRecords = [
    {
      id: '1',
      animalId: '2',
      recordType: 'treatment' as const,
      description: 'Treated for respiratory infection',
      date: new Date('2024-01-15'),
      veterinarian: 'Smith',
      cost: 75
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Farm Pilot Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive farm management and monitoring platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-chart-1">
                Total Farms
              </CardTitle>
              <MapPin className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-chart-1">+1 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-chart-2">
                Active Crops
              </CardTitle>
              <Sprout className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-chart-2">8 ready for harvest</p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-chart-4">
                Livestock
              </CardTitle>
              <Heart className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">127</div>
              <p className="text-xs text-chart-4">95% healthy</p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-chart-5">
                Equipment
              </CardTitle>
              <Tractor className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">7</div>
              <p className="text-xs text-chart-5">2 need maintenance</p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-chart-3">
                Inventory
              </CardTitle>
              <Package className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">243</div>
              <p className="text-xs text-chart-3">15 items low stock</p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45.2K</div>
              <p className="text-xs text-primary">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

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
              {/* Recent Activity */}
              <Card className="lg:col-span-2 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-chart-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates from your farms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Corn harvest completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        North Field • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Cattle vaccination scheduled
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Livestock Group A • 4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Soil test results received
                      </p>
                      <p className="text-xs text-muted-foreground">
                        South Field • 1 day ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                    <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Equipment maintenance completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tractor #2 • 2 days ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts & Weather */}
              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-chart-5" />
                    Alerts & Weather
                  </CardTitle>
                  <CardDescription>
                    Important notifications and weather updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-chart-5" />
                      <span className="font-medium text-foreground">
                        Pest Alert
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aphid activity detected in tomato crops. Consider organic
                      treatment.
                    </p>
                  </div>

                  <div className="p-4 bg-secondary border border-destructive rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-foreground">
                        Livestock Health
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cattle #C002 requires immediate veterinary attention.
                    </p>
                  </div>

                  <div className="p-4 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">
                        Today's Weather
                      </span>
                      <span className="text-2xl">☀️</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sunny, 75°F. Perfect conditions for field work.
                    </p>
                  </div>

                  <div className="p-4 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-chart-4" />
                      <span className="font-medium text-foreground">
                        Inventory Alert
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fertilizer stock running low. Reorder recommended.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-chart-1" />
                    Crop Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Corn</span>
                      <span className="text-sm font-medium text-chart-1">
                        +15%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tomatoes</span>
                      <span className="text-sm font-medium text-chart-1">
                        +8%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Soybeans</span>
                      <span className="text-sm font-medium text-destructive">
                        -3%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-chart-2" />
                    Team Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Tasks Completed</span>
                      <span className="text-sm font-medium">23/28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Members</span>
                      <span className="text-sm font-medium text-chart-1">
                        5/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Efficiency</span>
                      <span className="text-sm font-medium text-chart-1">
                        94%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="text-sm font-medium text-chart-1">
                        $45,200
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expenses</span>
                      <span className="text-sm font-medium text-destructive">
                        $32,100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit</span>
                      <span className="text-sm font-medium text-primary">
                        $13,100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-chart-1">Seeds</h3>
                      <p className="text-2xl font-bold">45 items</p>
                      <p className="text-sm text-muted-foreground">
                        3 low stock
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-chart-2">
                        Fertilizers
                      </h3>
                      <p className="text-2xl font-bold">23 items</p>
                      <p className="text-sm text-muted-foreground">
                        1 expiring soon
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-chart-4">Feed</h3>
                      <p className="text-2xl font-bold">12 items</p>
                      <p className="text-sm text-muted-foreground">
                        All in stock
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-chart-5">Tools</h3>
                      <p className="text-2xl font-bold">67 items</p>
                      <p className="text-sm text-muted-foreground">
                        5 need replacement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Management</CardTitle>
                  <CardDescription>
                    Track and maintain farm machinery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Operational Equipment</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                          <span>John Deere Tractor</span>
                          <span className="text-sm text-chart-1">
                            Operational
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                          <span>Combine Harvester</span>
                          <span className="text-sm text-chart-1">
                            Operational
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Needs Maintenance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                          <span>Irrigation System</span>
                          <span className="text-sm text-chart-5">
                            Maintenance Due
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                          <span>Disc Harrow</span>
                          <span className="text-sm text-destructive">
                            Broken
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>Assign and track farm tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">To Do</h3>
                        <div className="space-y-2">
                          <div className="p-3 bg-secondary border border-chart-2 rounded-lg">
                            <h4 className="font-medium">Plant tomatoes</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: Tomorrow
                            </p>
                          </div>
                          <div className="p-3 bg-secondary border border-chart-2 rounded-lg">
                            <h4 className="font-medium">Feed cattle</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: Today
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">In Progress</h3>
                        <div className="space-y-2">
                          <div className="p-3 bg-secondary border border-chart-5 rounded-lg">
                            <h4 className="font-medium">Harvest corn</h4>
                            <p className="text-sm text-muted-foreground">
                              Started: 2 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Completed</h3>
                        <div className="space-y-2">
                          <div className="p-3 bg-secondary border border-chart-1 rounded-lg">
                            <h4 className="font-medium">Soil testing</h4>
                            <p className="text-sm text-muted-foreground">
                              Completed: Yesterday
                            </p>
                          </div>
                          <div className="p-3 bg-secondary border border-chart-1 rounded-lg">
                            <h4 className="font-medium">
                              Equipment maintenance
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Completed: 2 days ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Analytics</CardTitle>
                  <CardDescription>
                    Performance insights and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Yield Trends</h3>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Yield chart would go here
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">
                        Financial Performance
                      </h3>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Financial chart would go here
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
