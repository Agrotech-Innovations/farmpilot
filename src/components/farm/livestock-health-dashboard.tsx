import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Heart,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  Syringe,
  Shield
} from 'lucide-react';

interface LivestockAnimal {
  id: string;
  tagNumber: string;
  name?: string;
  species: string;
  breed: string;
  age: number;
  healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
  lastCheckup: Date;
  nextVaccination?: Date;
  weight?: number;
}

interface HealthRecord {
  id: string;
  animalId: string;
  recordType: 'vaccination' | 'treatment' | 'checkup' | 'injury' | 'illness';
  description: string;
  date: Date;
  veterinarian?: string;
  cost?: number;
}

interface LivestockHealthDashboardProps {
  animals: LivestockAnimal[];
  healthRecords: HealthRecord[];
  onScheduleTreatment: (animalId: string) => void;
  onUpdateHealth: (animalId: string, status: string) => void;
}

export function LivestockHealthDashboard({
  animals,
  healthRecords,
  onScheduleTreatment,
  onUpdateHealth
}: LivestockHealthDashboardProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'injured':
        return 'bg-yellow-100 text-yellow-800';
      case 'deceased':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStats = () => {
    const total = animals.length;
    const healthy = animals.filter((a) => a.healthStatus === 'healthy').length;
    const sick = animals.filter((a) => a.healthStatus === 'sick').length;
    const injured = animals.filter((a) => a.healthStatus === 'injured').length;

    return {total, healthy, sick, injured};
  };

  const getUpcomingVaccinations = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return animals.filter(
      (animal) =>
        animal.nextVaccination &&
        animal.nextVaccination >= now &&
        animal.nextVaccination <= nextWeek
    );
  };

  const getRecentHealthRecords = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return healthRecords
      .filter((record) => record.date >= oneWeekAgo)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  };

  const getAnimalById = (id: string) => animals.find((a) => a.id === id);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const stats = getHealthStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Livestock Health Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor animal health and schedule treatments
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Syringe className="w-4 h-4 mr-2" />
          Schedule Treatment
        </Button>
      </div>

      {/* Health Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.healthy}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.healthy / stats.total) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Need Attention
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.sick + stats.injured}
            </div>
            <p className="text-xs text-muted-foreground">
              Sick or injured animals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vaccinations Due
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {getUpcomingVaccinations().length}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Animals Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-chart-3" />
                  Animals Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {animals
                    .filter((animal) => animal.healthStatus !== 'healthy')
                    .map((animal) => (
                      <div
                        key={animal.id}
                        className="flex items-center justify-between p-3 bg-secondary border border-chart-3 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">
                            {animal.name || `Tag #${animal.tagNumber}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {animal.species} • {animal.breed}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={getHealthStatusColor(
                              animal.healthStatus
                            )}
                          >
                            {animal.healthStatus}
                          </Badge>
                          <Button
                            size="sm"
                            className="ml-2"
                            onClick={() => onScheduleTreatment(animal.id)}
                          >
                            Treat
                          </Button>
                        </div>
                      </div>
                    ))}
                  {animals.filter((animal) => animal.healthStatus !== 'healthy')
                    .length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      All animals are healthy! 🎉
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Vaccinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming Vaccinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingVaccinations().map((animal) => (
                    <div
                      key={animal.id}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {animal.name || `Tag #${animal.tagNumber}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {animal.species}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-700">
                          {animal.nextVaccination &&
                            formatDate(animal.nextVaccination)}
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                  {getUpcomingVaccinations().length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No vaccinations due this week
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Health Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Health Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentHealthRecords().map((record) => {
                  const animal = getAnimalById(record.animalId);
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {animal?.name || `Tag #${animal?.tagNumber}`} -{' '}
                          {record.recordType}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {record.description}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {formatDate(record.date)}
                        {record.veterinarian && (
                          <p className="text-xs">Dr. {record.veterinarian}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animals">
          <Card>
            <CardHeader>
              <CardTitle>All Animals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animals.map((animal) => (
                  <div
                    key={animal.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        {animal.name || `Tag #${animal.tagNumber}`}
                      </h3>
                      <Badge
                        className={getHealthStatusColor(animal.healthStatus)}
                      >
                        {animal.healthStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {animal.species} • {animal.breed}
                    </p>
                    <p className="text-sm text-gray-600">
                      {animal.age} years old
                    </p>
                    {animal.weight && (
                      <p className="text-sm text-gray-600">
                        {animal.weight} lbs
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Last checkup: {formatDate(animal.lastCheckup)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Treatment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthRecords
                  .filter((record) => record.recordType === 'treatment')
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((record) => {
                    const animal = getAnimalById(record.animalId);
                    return (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {animal?.name || `Tag #${animal?.tagNumber}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {record.description}
                            </p>
                            {record.veterinarian && (
                              <p className="text-sm text-gray-500">
                                Dr. {record.veterinarian}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatDate(record.date)}
                            </p>
                            {record.cost && (
                              <p className="text-sm text-gray-600">
                                ${record.cost}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Health Rate</span>
                    <span className="font-bold text-green-600">
                      {((stats.healthy / stats.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{width: `${(stats.healthy / stats.total) * 100}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {stats.healthy} out of {stats.total} animals are healthy
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Treatment Costs</span>
                    <span className="font-bold">
                      $
                      {healthRecords
                        .filter((r) => r.cost)
                        .reduce((sum, r) => sum + (r.cost || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Cost per Animal</span>
                    <span className="font-medium">
                      $
                      {(
                        healthRecords
                          .filter((r) => r.cost)
                          .reduce((sum, r) => sum + (r.cost || 0), 0) /
                        stats.total
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
