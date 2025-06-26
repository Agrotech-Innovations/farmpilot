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
  Plus
} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Farm Pilot Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive farm management and monitoring
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Farm
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Farms
              </CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">3</div>
              <p className="text-xs text-green-600">+1 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Active Crops
              </CardTitle>
              <Sprout className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">12</div>
              <p className="text-xs text-blue-600">8 ready for harvest</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">
                Equipment
              </CardTitle>
              <Tractor className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">7</div>
              <p className="text-xs text-orange-600">2 need maintenance</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">5</div>
              <p className="text-xs text-purple-600">All active today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates from your farms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Corn harvest completed
                      </p>
                      <p className="text-xs text-gray-500">
                        North Field • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Irrigation scheduled
                      </p>
                      <p className="text-xs text-gray-500">
                        East Field • 4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Soil test results received
                      </p>
                      <p className="text-xs text-gray-500">
                        South Field • 1 day ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather & Alerts */}
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Alerts & Weather
                  </CardTitle>
                  <CardDescription>
                    Important notifications and weather updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        Pest Alert
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Aphid activity detected in tomato crops. Consider organic
                      treatment.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">
                        Today's Weather
                      </span>
                      <span className="text-2xl">☀️</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      75°F, Sunny • Perfect for field work
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Growth Update
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Wheat crops are 15% ahead of schedule this season.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crops" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample crop cards */}
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Corn - North Field</CardTitle>
                  <CardDescription>Planted March 15, 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium text-green-600">
                        Growing
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Acres:</span>
                      <span className="text-sm font-medium">25.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Expected Harvest:
                      </span>
                      <span className="text-sm font-medium">August 20</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Soybeans - East Field
                  </CardTitle>
                  <CardDescription>Planted April 2, 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium text-yellow-600">
                        Planted
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Acres:</span>
                      <span className="text-sm font-medium">18.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Expected Harvest:
                      </span>
                      <span className="text-sm font-medium">September 15</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <Plus className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-700 mb-2">
                    Add New Crop
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Plan and track a new crop for this season
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Crop
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="livestock">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Livestock Management</CardTitle>
                <CardDescription>
                  Manage your livestock, health records, and breeding schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Livestock Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Track animal health, breeding records, and grazing rotations
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Assign and track farm tasks and maintenance schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Task System Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Schedule maintenance, assign work, and track progress
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Farm Analytics</CardTitle>
                <CardDescription>
                  Performance insights and yield analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics Dashboard Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Detailed reports on yield, productivity, and farm
                    performance
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
