import {
  MapPin,
  Sprout,
  Heart,
  Tractor,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import type {
  MetricCardData,
  ActivityData,
  AlertData,
  WeatherData,
  CropPerformanceData,
  TeamActivityData,
  FinancialSummaryData,
  InventoryCategory,
  Equipment,
  Task,
  AnalyticsData
} from '@/components/farm';

// Crop and field data
export const mockCrops = [
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

export const mockFields = [
  {id: '1', name: 'North Field', acres: 25, soilType: 'Loam'},
  {id: '2', name: 'East Field', acres: 15, soilType: 'Clay'},
  {id: '3', name: 'South Field', acres: 20, soilType: 'Sandy'}
];

// Livestock data
export const mockAnimals = [
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

export const mockHealthRecords = [
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

// Dashboard metrics
export const mockMetrics: MetricCardData[] = [
  {
    title: 'Total Farms',
    value: 3,
    subtitle: '+1 from last month',
    icon: MapPin,
    colorClass: 'text-chart-1'
  },
  {
    title: 'Active Crops',
    value: 12,
    subtitle: '8 ready for harvest',
    icon: Sprout,
    colorClass: 'text-chart-2'
  },
  {
    title: 'Livestock',
    value: 127,
    subtitle: '95% healthy',
    icon: Heart,
    colorClass: 'text-chart-4'
  },
  {
    title: 'Equipment',
    value: 7,
    subtitle: '2 need maintenance',
    icon: Tractor,
    colorClass: 'text-chart-5'
  },
  {
    title: 'Inventory',
    value: 243,
    subtitle: '15 items low stock',
    icon: Package,
    colorClass: 'text-chart-3'
  },
  {
    title: 'Revenue',
    value: '$45.2K',
    subtitle: '+12% from last month',
    icon: DollarSign,
    colorClass: 'text-primary'
  }
];

// Recent activities
export const mockActivities: ActivityData[] = [
  {
    id: '1',
    title: 'Corn harvest completed',
    subtitle: 'North Field • 2 hours ago',
    colorClass: 'bg-chart-1'
  },
  {
    id: '2',
    title: 'Cattle vaccination scheduled',
    subtitle: 'Livestock Group A • 4 hours ago',
    colorClass: 'bg-chart-5'
  },
  {
    id: '3',
    title: 'Soil test results received',
    subtitle: 'South Field • 1 day ago',
    colorClass: 'bg-chart-2'
  },
  {
    id: '4',
    title: 'Equipment maintenance completed',
    subtitle: 'Tractor #2 • 2 days ago',
    colorClass: 'bg-chart-4'
  }
];

// Alerts and weather
export const mockAlerts: AlertData[] = [
  {
    id: '1',
    type: 'pest',
    title: 'Pest Alert',
    description:
      'Aphid activity detected in tomato crops. Consider organic treatment.',
    severity: 'medium',
    icon: AlertTriangle
  },
  {
    id: '2',
    type: 'health',
    title: 'Livestock Health',
    description: 'Cattle #C002 requires immediate veterinary attention.',
    severity: 'high',
    icon: Heart
  },
  {
    id: '3',
    type: 'inventory',
    title: 'Inventory Alert',
    description: 'Fertilizer stock running low. Reorder recommended.',
    severity: 'low',
    icon: Package
  }
];

export const mockWeather: WeatherData = {
  condition: "Today's Weather",
  temperature: '75°F',
  description: 'Perfect conditions for field work',
  emoji: '☀️'
};

// Performance data
export const mockCropPerformance: CropPerformanceData[] = [
  {name: 'Corn', change: '+15%', isPositive: true},
  {name: 'Tomatoes', change: '+8%', isPositive: true},
  {name: 'Soybeans', change: '-3%', isPositive: false}
];

export const mockTeamActivity: TeamActivityData[] = [
  {label: 'Tasks Completed', value: '23/28'},
  {label: 'Active Members', value: '5/5', isPositive: true},
  {label: 'Efficiency', value: '94%', isPositive: true}
];

export const mockFinancialSummary: FinancialSummaryData[] = [
  {label: 'Revenue', value: '$45,200', type: 'revenue'},
  {label: 'Expenses', value: '$32,100', type: 'expense'},
  {label: 'Profit', value: '$13,100', type: 'profit'}
];

// Inventory categories
export const mockInventoryCategories: InventoryCategory[] = [
  {
    name: 'Seeds',
    count: 45,
    status: '3 low stock',
    colorClass: 'text-chart-1'
  },
  {
    name: 'Fertilizers',
    count: 23,
    status: '1 expiring soon',
    colorClass: 'text-chart-2'
  },
  {
    name: 'Feed',
    count: 12,
    status: 'All in stock',
    colorClass: 'text-chart-4'
  },
  {
    name: 'Tools',
    count: 67,
    status: '5 need replacement',
    colorClass: 'text-chart-5'
  }
];

// Equipment data
export const mockOperationalEquipment: Equipment[] = [
  {id: '1', name: 'John Deere Tractor', status: 'operational'},
  {id: '2', name: 'Combine Harvester', status: 'operational'}
];

export const mockMaintenanceEquipment: Equipment[] = [
  {id: '3', name: 'Irrigation System', status: 'maintenance'},
  {id: '4', name: 'Disc Harrow', status: 'broken'}
];

// Task data
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Plant tomatoes',
    dueDate: 'Tomorrow',
    status: 'todo'
  },
  {
    id: '2',
    title: 'Feed cattle',
    dueDate: 'Today',
    status: 'todo'
  },
  {
    id: '3',
    title: 'Harvest corn',
    dueDate: '2 hours ago',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Soil testing',
    dueDate: 'Yesterday',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Equipment maintenance',
    dueDate: '2 days ago',
    status: 'completed'
  }
];

// Analytics data
export const mockAnalyticsData: AnalyticsData = {
  yieldTrends: [], // Placeholder for chart data
  financialPerformance: [] // Placeholder for chart data
};
