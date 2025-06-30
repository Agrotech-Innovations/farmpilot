# Farm Pilot API Documentation

## Overview

Farm Pilot provides a comprehensive REST-like API built with TanStack Start server functions. All endpoints are type-safe with Zod validation and follow Clean Architecture principles.

**Base URL**: `http://localhost:3000` (development)

## Authentication

All API endpoints (except registration and login) require authentication via JWT tokens.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### Register User

Creates a new user and organization.

**Endpoint**: `registerUser`  
**Method**: POST

**Request Body**:

```typescript
{
  email: string;           // Valid email address
  password: string;        // Minimum 8 characters
  firstName: string;       // Required
  lastName: string;        // Required
  phone?: string;          // Optional
  organizationName: string; // Required
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
    };
    organization: {
      id: string;
      name: string;
      slug: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}
```

### Login User

Authenticates a user and returns tokens.

**Endpoint**: `loginUser`  
**Method**: POST

**Request Body**:

```typescript
{
  email: string;
  password: string;
  twoFactorCode?: string; // Required if 2FA is enabled
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      twoFactorEnabled: boolean;
    };
    accessToken: string;
    refreshToken: string;
    requiresTwoFactor?: boolean;
    tempToken?: string;
  };
  error?: string;
}
```

### Enable Two-Factor Authentication

Sets up 2FA for a user account.

**Endpoint**: `enableTwoFactor`  
**Method**: POST

**Request Body**:

```typescript
{
  userId: string;
  appName?: string; // Default: "Farm Pilot"
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  };
  error?: string;
}
```

---

## 🚜 Farm Management Endpoints

### Create Farm

Creates a new farm for an organization.

**Endpoint**: `createFarm`  
**Method**: POST

**Request Body**:

```typescript
{
  name: string;
  description?: string;
  address?: string;
  latitude?: number;      // -90 to 90
  longitude?: number;     // -180 to 180
  totalAcres?: number;    // >= 0
  farmType?: "crop" | "livestock" | "mixed" | "organic";
  organizationId: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    totalAcres: number | null;
    farmType: string | null;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}
```

### List Farms

Retrieves all farms for an organization.

**Endpoint**: `listFarms`  
**Method**: GET

**Request Body**:

```typescript
{
  organizationId: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    farms: Farm[];
  };
  error?: string;
}
```

---

## 🐄 Livestock Management Endpoints

### Create Livestock Group

Creates a new livestock group.

**Endpoint**: `createLivestockGroup`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  species: string;
  breed?: string;
  initialCount?: number; // >= 0
}
```

### Add Livestock Animal

Adds an individual animal to a group.

**Endpoint**: `addLivestockAnimal`  
**Method**: POST

**Request Body**:

```typescript
{
  groupId: string;
  tagNumber: string;
  name?: string;
  sex: "male" | "female";
  birthDate?: string;     // ISO date string
  breed?: string;
  motherTagNumber?: string;
  fatherTagNumber?: string;
  currentWeight?: number; // >= 0
}
```

### Create Health Record

Records a health event for an animal.

**Endpoint**: `createHealthRecord`  
**Method**: POST

**Request Body**:

```typescript
{
  animalId: string;
  recordType: "vaccination" | "treatment" | "checkup" | "injury" | "illness";
  description: string;
  treatment?: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;         // >= 0
  notes?: string;
}
```

### Update Animal Health Status

Updates an animal's health status.

**Endpoint**: `updateAnimalHealth`  
**Method**: POST

**Request Body**:

```typescript
{
  animalId: string;
  healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
}
```

### Get Livestock Analytics

Retrieves comprehensive health analytics for a farm.

**Endpoint**: `getLivestockAnalytics`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    totalAnimals: number;
    healthStats: {
      healthy: number;
      sick: number;
      injured: number;
      deceased: number;
    };
    recentTreatments: HealthRecord[];
    upcomingVaccinations: HealthRecord[];
    costAnalysis: {
      totalCosts: number;
      averageCostPerAnimal: number;
    };
  };
  error?: string;
}
```

### Schedule Vaccination

Schedules a vaccination for an individual animal.

**Endpoint**: `scheduleVaccination`  
**Method**: POST

**Request Body**:

```typescript
{
  animalId: string;
  vaccinationType: string;
  description: string;
  scheduledDate?: string; // ISO date string
  veterinarian?: string;
  cost?: number;         // >= 0
  notes?: string;
}
```

### Create Vaccination Schedule

Bulk schedules vaccinations for multiple animals or groups.

**Endpoint**: `createVaccinationSchedule`  
**Method**: POST

**Request Body**:

```typescript
{
  animalIds?: string[];
  groupId?: string;
  scheduleItems: {
    vaccinationType: string;
    description: string;
    intervalDays: number;    // >= 1
    initialDate: string;     // ISO date string
    veterinarian?: string;
    estimatedCost?: number;  // >= 0
    notes?: string;
  }[];
  autoScheduleNext?: boolean;
}
```

### Get Vaccination Reminders

Retrieves prioritized vaccination reminders.

**Endpoint**: `getVaccinationReminders`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  daysAhead?: number;      // >= 1, default: 30
  includeOverdue?: boolean;
  vaccinationType?: string;
  priorityLevel?: "high" | "medium" | "low" | "all";
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    reminders: {
      upcoming: VaccinationReminder[];
      dueSoon: VaccinationReminder[];
      overdue: VaccinationReminder[];
    };
    totalEstimatedCost: number;
    priorityBreakdown: {
      high: number;
      medium: number;
      low: number;
    };
  };
  error?: string;
}
```

---

## 🔧 Equipment Management Endpoints

### Create Equipment

Adds new equipment to a farm.

**Endpoint**: `createEquipment`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;   // ISO date string
  purchasePrice?: number;  // >= 0
  currentValue?: number;   // >= 0
  status?: "operational" | "maintenance" | "broken" | "retired";
}
```

### Update Equipment

Updates equipment details.

**Endpoint**: `updateEquipment`  
**Method**: POST

**Request Body**:

```typescript
{
  equipmentId: string;
  name?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  currentValue?: number;   // >= 0
  status?: "operational" | "maintenance" | "broken" | "retired";
}
```

### Schedule Maintenance

Schedules maintenance for equipment.

**Endpoint**: `scheduleMaintenance`  
**Method**: POST

**Request Body**:

```typescript
{
  equipmentId: string;
  maintenanceType: string;
  description: string;
  scheduledDate: string;   // ISO date string
  estimatedCost?: number;  // >= 0
  serviceProvider?: string;
  notes?: string;
}
```

### Get Equipment Analytics

Retrieves equipment usage and cost analytics.

**Endpoint**: `getEquipmentAnalytics`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  equipmentId?: string;    // Optional: specific equipment
}
```

---

## 📦 Inventory Management Endpoints

### Create Inventory Item

Adds a new item to inventory.

**Endpoint**: `createInventoryItem`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  category: "seeds" | "fertilizers" | "feed" | "tools" | "produce" | "other";
  currentQuantity: number;  // >= 0
  unit: string;
  unitCost?: number;        // >= 0
  lowStockThreshold?: number; // >= 0
  expirationDate?: string;  // ISO date string
  supplier?: string;
  notes?: string;
}
```

### Record Inventory Transaction

Records stock movements (in/out).

**Endpoint**: `recordInventoryTransaction`  
**Method**: POST

**Request Body**:

```typescript
{
  itemId: string;
  transactionType: "in" | "out" | "adjustment";
  quantity: number;
  unitCost?: number;        // >= 0
  reference?: string;       // Purchase order, usage reference, etc.
  notes?: string;
}
```

### Get Inventory Analytics

Retrieves inventory usage and turnover analytics.

**Endpoint**: `getInventoryAnalytics`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  category?: string;
  daysBack?: number;        // Default: 30
}
```

### Get Inventory Alerts

Retrieves low stock and expiration alerts.

**Endpoint**: `getInventoryAlerts`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  alertType?: "low_stock" | "expiring" | "all";
  daysAhead?: number;       // For expiration alerts
}
```

---

## 📋 Task Management Endpoints

### Create Task

Creates a new task.

**Endpoint**: `createTask`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  title: string;
  description?: string;
  assignedTo?: string;      // User ID
  dueDate?: string;         // ISO date string
  priority: "low" | "medium" | "high" | "urgent";
  category?: string;
  estimatedHours?: number;  // >= 0
  cropId?: string;          // If task is crop-related
  equipmentId?: string;     // If task is equipment-related
}
```

### Update Task Status

Updates task progress and status.

**Endpoint**: `updateTaskStatus`  
**Method**: POST

**Request Body**:

```typescript
{
  taskId: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  actualHours?: number;     // >= 0
  completionNotes?: string;
}
```

### List Tasks

Retrieves filtered list of tasks.

**Endpoint**: `listTasks`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;      // User ID
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  dueDateStart?: string;    // ISO date string
  dueDateEnd?: string;      // ISO date string
  limit?: number;           // Default: 50
  offset?: number;          // Default: 0
}
```

---

## 🌾 Crop Management Endpoints

### Create Crop

Creates a new crop record.

**Endpoint**: `createCrop`  
**Method**: POST

**Request Body**:

```typescript
{
  name: string;
  variety?: string;
  plantingDate?: string;    // ISO date string
  expectedHarvestDate?: string; // ISO date string
  farmId: string;
  fieldId?: string;
  plannedAcres?: number;    // >= 0
}
```

### Plan Crop Planting

Plans crop planting with rotation analysis.

**Endpoint**: `planCropPlanting`  
**Method**: POST

**Request Body**:

```typescript
{
  cropId: string;
  plantingDate: string;     // ISO date string
  expectedHarvestDate: string; // ISO date string
  plannedAcres: number;     // >= 0
  fieldId?: string;
  rotationNotes?: string;
}
```

---

## 🔬 Breeding Management Endpoints

### Create Breeding Record

Records a breeding event.

**Endpoint**: `createBreedingRecord`  
**Method**: POST

**Request Body**:

```typescript
{
  motherAnimalId: string;
  fatherAnimalId?: string;
  breedingDate: string;     // ISO date string
  expectedBirthDate?: string; // ISO date string
  notes?: string;
}
```

### Update Pregnancy Status

Updates the pregnancy status of a breeding record.

**Endpoint**: `updatePregnancyStatus`  
**Method**: POST

**Request Body**:

```typescript
{
  breedingRecordId: string;
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  pregnancyConfirmedDate?: string; // ISO date string
  birthDate?: string;              // ISO date string
  birthWeight?: number;            // >= 0
  birthNotes?: string;
  veterinarian?: string;
}
```

### Get Breeding Records

Retrieves breeding records with optional filtering.

**Endpoint**: `getBreedingRecords`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  pregnancyStatus?: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  startDate?: string;      // ISO date string
  endDate?: string;        // ISO date string
}
```

### Get Breeding Analytics

Retrieves comprehensive breeding analytics and insights.

**Endpoint**: `getBreedingAnalytics`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  timeframe?: 'month' | 'quarter' | 'year' | 'all';
}
```

**Response**:

```typescript
{
  success: true;
  data: {
    totalBreedings: number;
    successfulPregnancies: number;
    successRate: number;
    abortionRate: number;
    avgGestationDays: number;
    birthsByMonth: Array<{month: string; births: number}>;
    breedingsByStatus: {
      bred: number;
      confirmed: number;
      aborted: number;
      birthed: number;
    }
    topPerformingMothers: Array<{
      animalId: string;
      tagNumber: string;
      successfulBirths: number;
      totalBreedings: number;
      successRate: number;
    }>;
    insights: Array<{
      type: string;
      message: string;
      severity: 'info' | 'warning' | 'critical';
    }>;
  }
}
```

### Delete Breeding Record

Deletes a breeding record.

**Endpoint**: `deleteBreedingRecord`  
**Method**: POST

**Request Body**:

```typescript
{
  breedingRecordId: string;
}
```

---

## 💉 Advanced Vaccination System Endpoints

### Create Vaccination Schedule

Creates a vaccination schedule with automatic recurring setup.

**Endpoint**: `createVaccinationSchedule`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  vaccineName: string;
  description?: string;
  ageInDays?: number;          // Age when vaccination should be given
  intervalDays?: number;       // Days between recurring vaccinations
  isRecurring?: boolean;
  priority?: 'low' | 'medium' | 'high';
  species?: string[];          // Array of species this applies to
  breed?: string[];            // Array of breeds this applies to
  notes?: string;
}
```

### Get Vaccination Schedule

Retrieves vaccination schedules for a farm.

**Endpoint**: `getVaccinationSchedule`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  species?: string;
  breed?: string;
}
```

### Schedule Individual Vaccination

Schedules a vaccination for a specific animal.

**Endpoint**: `scheduleVaccination`  
**Method**: POST

**Request Body**:

```typescript
{
  animalId: string;
  vaccineName: string;
  scheduledDate: string;       // ISO date string
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  cost?: number;               // >= 0
  veterinarian?: string;
}
```

### Bulk Schedule Vaccinations

Schedules vaccinations for multiple animals with advanced filtering.

**Endpoint**: `bulkScheduleVaccinations`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  vaccineName: string;
  scheduledDate: string;       // ISO date string
  filters?: {
    species?: string[];
    breed?: string[];
    minAge?: number;           // Minimum age in days
    maxAge?: number;           // Maximum age in days
    healthStatus?: string[];
    excludeRecentlyVaccinated?: boolean;
    daysSinceLastVaccination?: number;
  };
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  cost?: number;               // >= 0
  veterinarian?: string;
}
```

### Update Vaccination Status

Updates the status of a scheduled vaccination.

**Endpoint**: `updateVaccinationStatus`  
**Method**: POST

**Request Body**:

```typescript
{
  vaccinationId: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  administeredDate?: string;   // ISO date string
  actualCost?: number;         // >= 0
  batchNumber?: string;
  expirationDate?: string;     // ISO date string
  administeredBy?: string;
  reactions?: string;
  notes?: string;
}
```

### Get Vaccination Reminders

Retrieves upcoming vaccination reminders with intelligent prioritization.

**Endpoint**: `getVaccinationReminders`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  daysAhead?: number;          // Default: 7 days
  priority?: 'low' | 'medium' | 'high';
  includeOverdue?: boolean;    // Default: true
}
```

**Response**:

```typescript
{
  success: true;
  data: {
    reminders: Array<{
      id: string;
      animalId: string;
      animalTagNumber: string;
      vaccineName: string;
      scheduledDate: string;
      daysUntilDue: number;
      priority: 'low' | 'medium' | 'high';
      isOverdue: boolean;
      cost?: number;
      veterinarian?: string;
      notes?: string;
    }>;
    summary: {
      totalReminders: number;
      overdueCount: number;
      highPriorityCount: number;
      totalEstimatedCost: number;
    }
  }
}
```

---

## 🏭 Equipment Management Endpoints

### Create Equipment

Adds new equipment to the farm inventory.

**Endpoint**: `createEquipment`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;       // ISO date string
  purchasePrice?: number;      // >= 0
  location?: string;
}
```

### List Equipment

Retrieves farm equipment with optional filtering.

**Endpoint**: `listEquipment`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  type?: string;
}
```

### Get Equipment

Retrieves detailed information about specific equipment.

**Endpoint**: `getEquipment`  
**Method**: GET

**Query Parameters**:

```typescript
{
  id: string;
}
```

### Update Equipment

Updates equipment information.

**Endpoint**: `updateEquipment`  
**Method**: POST

**Request Body**:

```typescript
{
  id: string;
  name?: string;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;       // ISO date string
  purchasePrice?: number;      // >= 0
  currentValue?: number;       // >= 0
  status?: 'operational' | 'maintenance' | 'broken' | 'retired';
  location?: string;
}
```

### Delete Equipment

Removes equipment from the farm inventory.

**Endpoint**: `deleteEquipment`  
**Method**: POST

**Request Body**:

```typescript
{
  id: string;
}
```

### Schedule Maintenance

Schedules maintenance for equipment.

**Endpoint**: `scheduleMaintenance`  
**Method**: POST

**Request Body**:

```typescript
{
  equipmentId: string;
  maintenanceType: 'routine' | 'repair' | 'inspection' | 'replacement';
  description: string;
  cost?: number;               // >= 0
  performedBy?: string;
  serviceProvider?: string;
  nextServiceDate?: string;    // ISO date string
  notes?: string;
}
```

### Get Maintenance Records

Retrieves maintenance history for equipment.

**Endpoint**: `getMaintenanceRecords`  
**Method**: GET

**Query Parameters**:

```typescript
{
  equipmentId: string;
}
```

### Get Equipment Analytics

Retrieves equipment analytics and insights.

**Endpoint**: `getEquipmentAnalytics`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  startDate?: string;          // ISO date string
  endDate?: string;            // ISO date string
}
```

---

## 📦 Inventory Management Endpoints

### Create Inventory Item

Adds a new item to farm inventory.

**Endpoint**: `createInventoryItem`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  category: 'seeds' | 'fertilizers' | 'feed' | 'tools' | 'harvested_produce' | 'other';
  subcategory?: string;
  description?: string;
  initialQuantity: number;     // >= 0
  unit: string;
  minimumQuantity?: number;    // >= 0
  unitCost?: number;           // >= 0
  supplier?: string;
  sku?: string;
  brand?: string;
  expirationDate?: string;     // ISO date string
  storageLocation?: string;
}
```

### Get Inventory Item

Retrieves detailed information about a specific inventory item.

**Endpoint**: `getInventoryItem`  
**Method**: GET

**Query Parameters**:

```typescript
{
  id: string;
}
```

### List Inventory Items

Retrieves farm inventory with optional filtering.

**Endpoint**: `listInventoryItems`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  category?: string;
}
```

### Update Inventory Item

Updates inventory item information.

**Endpoint**: `updateInventoryItem`  
**Method**: POST

**Request Body**:

```typescript
{
  id: string;
  name?: string;
  category?: 'seeds' | 'fertilizers' | 'feed' | 'tools' | 'harvested_produce' | 'other';
  subcategory?: string;
  description?: string;
  unit?: string;
  minimumQuantity?: number;    // >= 0
  unitCost?: number;           // >= 0
  supplier?: string;
  sku?: string;
  brand?: string;
  expirationDate?: string;     // ISO date string
  storageLocation?: string;
}
```

### Delete Inventory Item

Removes an item from inventory.

**Endpoint**: `deleteInventoryItem`  
**Method**: POST

**Request Body**:

```typescript
{
  id: string;
}
```

### Record Inventory Transaction

Records inventory transactions (purchases, usage, sales, etc.).

**Endpoint**: `recordInventoryTransaction`  
**Method**: POST

**Request Body**:

```typescript
{
  itemId: string;
  transactionType: 'purchase' | 'usage' | 'sale' | 'adjustment' | 'waste';
  quantity: number;
  unitCost?: number;           // >= 0
  totalCost?: number;          // >= 0
  notes?: string;
  referenceNumber?: string;
}
```

### Get Inventory Transactions

Retrieves transaction history for an inventory item.

**Endpoint**: `getInventoryTransactions`  
**Method**: GET

**Query Parameters**:

```typescript
{
  itemId: string;
}
```

### Get Inventory Alerts

Retrieves inventory alerts for low stock and expiring items.

**Endpoint**: `getInventoryAlerts`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  expirationDaysAhead?: number; // Default: 30 days
}
```

### Get Inventory Analytics

Retrieves inventory analytics and insights.

**Endpoint**: `getInventoryAnalytics`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  itemId?: string;
  days?: number;               // Default: 30 days
}
```

---

## 📋 Task Management Endpoints

### Create Task

Creates a new farm task.

**Endpoint**: `createTask`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  cropId?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedToEmail?: string;
  assignedToName?: string;
  dueDate?: string;            // ISO date string
  scheduledDate?: string;      // ISO date string
  estimatedHours?: number;     // >= 0
  category?: string;
  tags?: string[];
}
```

### Get Task

Retrieves detailed information about a specific task.

**Endpoint**: `getTask`  
**Method**: GET

**Query Parameters**:

```typescript
{
  taskId: string;
}
```

### List Tasks

Retrieves farm tasks with filtering and statistics.

**Endpoint**: `listTasks`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedToEmail?: string;
  category?: string;
  includeCompleted?: boolean;
}
```

### Update Task Status

Updates the status of a task.

**Endpoint**: `updateTaskStatus`  
**Method**: POST

**Request Body**:

```typescript
{
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  actualHours?: number;        // >= 0
}
```

### Delete Task

Deletes a task.

**Endpoint**: `deleteTask`  
**Method**: POST

**Request Body**:

```typescript
{
  taskId: string;
}
```

### Search Tasks

Searches tasks with advanced filtering.

**Endpoint**: `searchTasks`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  query?: string;              // Search term
  status?: string[];
  priority?: string[];
  assignedToEmail?: string;
  category?: string;
  startDate?: string;          // ISO date string
  endDate?: string;            // ISO date string
  tags?: string[];
}
```

### Get Task Statistics

Retrieves task statistics and insights.

**Endpoint**: `getTaskStats`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
}
```

### Get Task Calendar

Retrieves tasks formatted for calendar display.

**Endpoint**: `getTaskCalendar`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}
```

---

## 🌾 Field Management Endpoints

### Create Field

Creates a new field within a farm.

**Endpoint**: `createField`  
**Method**: POST

**Request Body**:

```typescript
{
  farmId: string;
  name: string;
  description?: string;
  acres?: number;              // >= 0
  soilType?: string;
  coordinates?: string;
}
```

### List Fields

Retrieves all fields for a farm.

**Endpoint**: `listFields`  
**Method**: GET

**Query Parameters**:

```typescript
{
  farmId: string;
}
```

---

## 🔐 Authentication Endpoints

### Register User

Registers a new user and creates their organization.

**Endpoint**: `registerUser`  
**Method**: POST

**Request Body**:

```typescript
{
  email: string;
  password: string; // Min 8 characters
  firstName: string;
  lastName: string;
  organizationName: string;
}
```

### Login User

Authenticates a user and returns access token.

**Endpoint**: `loginUser`  
**Method**: POST

**Request Body**:

```typescript
{
  email: string;
  password: string;
}
```

### Enable Two-Factor Authentication

Enables 2FA for a user account.

**Endpoint**: `enableTwoFactor`  
**Method**: POST

**Request Body**:

```typescript
{
  userId: string;
}
```

### Confirm Two-Factor Authentication

Confirms 2FA setup with TOTP code.

**Endpoint**: `confirmTwoFactor`  
**Method**: POST

**Request Body**:

```typescript
{
  userId: string;
  token: string; // 6-digit TOTP code
}
```

---

## Error Handling

All endpoints return a consistent error format:

```typescript
{
  success: false;
  error: string; // Human-readable error message
}
```

### Common Error Codes

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

### Validation Errors

Input validation is handled by Zod schemas. Validation errors include:

- Required field missing
- Invalid data type
- Value out of range
- Invalid enum value
- Invalid date format

---

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production deployment.

---

## Data Types

### Common Types

```typescript
interface Farm {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  totalAcres: number | null;
  farmType: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LivestockAnimal {
  id: string;
  groupId: string;
  tagNumber: string;
  name: string | null;
  sex: string;
  birthDate: Date | null;
  breed: string | null;
  motherTagNumber: string | null;
  fatherTagNumber: string | null;
  currentWeight: number | null;
  healthStatus: string;
  age: number;
  isHealthy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface HealthRecord {
  id: string;
  animalId: string;
  recordType: string;
  description: string;
  treatment: string | null;
  medication: string | null;
  dosage: string | null;
  veterinarian: string | null;
  cost: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Testing the API

### Using curl

```bash
# Register a new user
curl -X POST http://localhost:3000/api/registerUser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Farmer",
    "organizationName": "Green Valley Farm"
  }'

# Create a livestock group
curl -X POST http://localhost:3000/api/createLivestockGroup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "farmId": "farm_id_here",
    "name": "Dairy Cows",
    "species": "cattle",
    "breed": "Holstein"
  }'
```

### Using JavaScript/TypeScript

```typescript
import {createLivestockGroup} from '@/presentation/controllers/livestock';

const result = await createLivestockGroup({
  farmId: 'farm_id_here',
  name: 'Dairy Cows',
  species: 'cattle',
  breed: 'Holstein'
});

if (result.success) {
  console.log('Group created:', result.data);
} else {
  console.error('Error:', result.error);
}
```

---

This API documentation covers all implemented endpoints in the Farm Pilot system. The backend is comprehensive and production-ready, providing extensive functionality for farm management operations.
