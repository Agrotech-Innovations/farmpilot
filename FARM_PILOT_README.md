# Farm Pilot - Comprehensive Farm Management SaaS Platform

> **Modern SaaS application for farm management and monitoring built with Clean Architecture principles**

![Farm Pilot Dashboard](https://img.shields.io/badge/Farm%20Pilot-SaaS%20Platform-green)
![Tech Stack](https://img.shields.io/badge/Tech-React%2019%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20TailwindCSS-blue)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange)
![Implementation Status](https://img.shields.io/badge/Backend-Production%20Ready-success)
![UI Status](https://img.shields.io/badge/Frontend-Needs%20Integration-yellow)

## 🌱 Overview

Farm Pilot is a comprehensive SaaS platform designed to solve the fragmentation problem faced by small farmers who currently juggle multiple tasks using scattered tools (spreadsheets, notebooks, different apps). Our integrated solution provides a centralized system for managing all aspects of farm operations.

**Current Status**: The backend is production-ready with advanced livestock management capabilities, but the frontend needs integration with the implemented APIs.

## ✨ Key Features

### ✅ **Fully Implemented & Production Ready**

#### 🔐 **Multi-Tenant Authentication & Security**

- **User Registration & Login** with email verification
- **Two-Factor Authentication (2FA)** with TOTP and backup codes
- **OAuth Support** (Google, GitHub, etc.)
- **JWT Stateless Sessions** for scalability
- **Multi-tenant architecture** with organization-based access control

#### 🐄 **Advanced Livestock Management** _(Production Ready)_

**Note**: This is our most comprehensive feature area with advanced capabilities.

- **Individual Animal Tracking** with tag numbers, breeds, genealogy
- **Group Management** for organizing animals by species/breed
- **Comprehensive Health Records** (vaccination, treatment, checkup, injury, illness)
- **Real-time Health Status Updates** with automatic record creation
- **Weight Tracking** with health record integration
- **Advanced Vaccination System**:
  - Individual and bulk vaccination scheduling
  - Recurring vaccination schedules with auto-scheduling
  - Priority-based reminder system (high/medium/low)
  - Vaccination status tracking (scheduled, completed, overdue)
  - Cost tracking and vaccination analytics
- **Breeding Management**:
  - Breeding record tracking with expected/actual birth dates
  - Pregnancy status monitoring
  - Breeding analytics and success rate tracking
  - Genealogy tracking (mother/father relationships)
- **Health Analytics**:
  - Farm-wide health statistics
  - Individual animal health histories
  - Treatment cost analysis
  - Vaccination compliance tracking

#### 📦 **Inventory Management**

- **Comprehensive Item Tracking** (seeds, fertilizers, feed, tools, produce)
- **Stock Level Alerts** and low stock notifications
- **Transaction History** with complete audit trail
- **Cost Tracking** with unit costs and total value calculations
- **Inventory Analytics** for usage patterns and turnover analysis
- **Multi-Category Support** with item-specific attributes

#### 🔧 **Equipment Management**

- **Equipment Registry** for all farm machinery and tools
- **Maintenance Scheduling** and tracking
- **Status Monitoring** (operational, maintenance, broken, retired)
- **Cost Tracking** (purchase price, current value, depreciation)
- **Service Records** and maintenance history
- **Equipment Analytics** for usage statistics and costs

#### 📋 **Task Management**

- **Task Creation & Assignment** to team members
- **Priority Classification** (low, medium, high, urgent)
- **Status Tracking** (pending, in progress, completed, cancelled)
- **Due Date Management** and deadline tracking
- **Category Organization** (planting, harvesting, maintenance)
- **Task Analytics** for completion rates and time estimates

#### 🚜 **Farm & Field Management**

- **Multiple Farms per Organization** with subscription-based limits
- **Farm Details Management** (location, acres, type, contact info)
- **Geographic Coordinates** support for mapping
- **Farm Type Classification** (crop, livestock, mixed, organic)
- **Field Management** with soil type tracking

### 🚧 **Partially Implemented**

#### 🌾 **Crop Management**

- **Basic Crop Creation**: ✅ Create crops with varieties and planting dates
- **Field Assignment**: ✅ Assign crops to specific fields
- **Growth Status**: ✅ Basic status tracking (planned, planted, growing, harvested)
- **Crop Planning Calendar**: 🔗 UI exists but uses mock data
- **Crop Rotation Intelligence**: 📋 Planned but not implemented
- **Yield Tracking**: 📋 Database schema ready, use cases needed

#### 📊 **Analytics & Reporting**

- **Backend Analytics**: ✅ Comprehensive analytics use cases implemented
- **Livestock Analytics**: ✅ Health reports and vaccination analytics ready
- **Equipment Analytics**: ✅ Usage and maintenance cost analysis ready
- **Inventory Analytics**: ✅ Stock turnover and consumption analysis ready
- **Dashboard Visualization**: 🔗 UI shows mock data instead of real analytics

### 📋 **Planned Features**

#### 🌤️ **Weather Integration** _(Not Implemented)_

- Real-time weather conditions and forecasts
- Agricultural alerts and recommendations
- Weather-informed task scheduling

#### 🔔 **Pest & Disease Management** _(Not Implemented)_

- Early warning system for pests and diseases
- Treatment tracking and effectiveness analysis
- Weather-based risk assessments

#### 🧪 **Soil Health Tracking** _(Not Implemented)_

- Soil test record management
- Amendment tracking and recommendations
- Historical soil health analysis

## 🚨 Critical Implementation Gap

### **UI-Backend Disconnection**

**Issue**: While we have a comprehensive, production-ready backend with 30+ API endpoints and advanced livestock management capabilities, the frontend currently uses mock data throughout.

**What Works**:

- ✅ 50+ business use cases implemented
- ✅ 11 repository implementations with 100+ methods
- ✅ Complete API layer with validation and error handling
- ✅ Advanced livestock health and vaccination systems
- ✅ Comprehensive inventory and equipment management

**What Needs Work**:

- 🔗 Replace mock data with real API calls in UI components
- 🔗 Implement proper state management and data fetching
- 🔗 Connect dashboard metrics to real farm data
- 🔗 Add loading states and error handling for API calls

## 🏗️ Architecture

Farm Pilot follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── core/                           # Business Logic (Domain + Application)
│   ├── domain/                     # Pure business logic
│   │   ├── entities/               # 10+ business entities
│   │   ├── repositories/           # Repository interfaces
│   │   └── value-objects/          # Domain value objects
│   └── application/                # Use cases and services
│       ├── use-cases/              # 50+ business use cases
│       ├── services/               # Application services
│       └── dtos/                   # Data transfer objects
├── infrastructure/                 # External concerns
│   ├── repositories/               # 11 database implementations
│   ├── auth/                       # Authentication services
│   ├── prisma/                     # Database client
│   └── di/                         # Dependency injection
├── presentation/                   # UI and API layer
│   ├── controllers/                # 30+ API endpoints
│   └── components/                 # React components
└── routes/                         # Page routing
```

### 🔄 **Dependency Flow**

- **Presentation** → **Application** → **Domain**
- **Infrastructure** can depend on **Domain** and **Application**
- **Domain** layer has no external dependencies
- Dependency injection ensures testability and modularity

## 🛠️ Tech Stack

### **Frontend & Framework**

- **React 19.1.0** - Latest React with concurrent features
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **TypeScript 5.8.3** - Static type checking

### **Styling & UI**

- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible components
- **Radix UI** - Primitive components for complex UI
- **Lucide React** - Beautiful, customizable icons

### **Backend & Database**

- **TanStack Start Server Functions** - 30+ API endpoints
- **Prisma ORM** - Type-safe database access
- **SQLite** (development) / **PostgreSQL** (production)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token management

### **Authentication & Security**

- **speakeasy** - TOTP for 2FA
- **qrcode** - QR code generation for 2FA setup
- **OAuth providers** - Social login integration

### **Development Tools**

- **Vite 7.0.0** - Lightning-fast build tool
- **ESLint & Prettier** - Code quality and formatting
- **Vitest** - Unit and integration testing
- **jsdom** - Browser environment for testing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd farmpilot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure the following variables:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_ACCESS_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_ACCESS_EXPIRY="15m"
   JWT_REFRESH_EXPIRY="7d"

   # OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Current User Interface Status

### **What You'll See**

- ✅ **Beautiful, modern UI** with comprehensive farm management interfaces
- ✅ **Livestock Health Dashboard** with sophisticated health tracking UI
- ✅ **Equipment Management** interface with maintenance tracking
- ✅ **Inventory Management** with stock level monitoring
- ✅ **Task Management** with priority and status tracking
- ✅ **Analytics Charts** and performance metrics

### **Important Note**

The UI currently displays **mock data** for demonstration purposes. While the interfaces are fully functional and beautiful, they need to be connected to the extensive backend API that's already implemented.

## 🔧 Available API Endpoints

The backend provides 30+ server functions across all domains:

### **Authentication**

- `registerUser` - User registration with organization creation
- `loginUser` - Login with 2FA support
- `enableTwoFactor` - 2FA setup and confirmation

### **Livestock Management** (10+ endpoints)

- `createLivestockGroup` - Create animal groups
- `addLivestockAnimal` - Add individual animals
- `createHealthRecord` - Record health events
- `updateAnimalHealth` - Update health status
- `getLivestockAnalytics` - Get health analytics
- `scheduleVaccination` - Schedule individual vaccinations
- `createVaccinationSchedule` - Bulk vaccination scheduling
- `getVaccinationReminders` - Get priority-based reminders
- And more...

### **Equipment Management**

- `createEquipment` - Add new equipment
- `updateEquipment` - Update equipment details
- `scheduleMaintenance` - Schedule maintenance
- `getEquipmentAnalytics` - Get usage analytics

### **Inventory Management**

- `createInventoryItem` - Add inventory items
- `recordInventoryTransaction` - Record stock movements
- `getInventoryAnalytics` - Get usage analytics
- `getInventoryAlerts` - Get low stock alerts

### **Task Management**

- `createTask` - Create new tasks
- `updateTaskStatus` - Update task progress
- `listTasks` - Get filtered task lists

## 🎯 Next Steps for Developers

### **Immediate Priority** (Connect UI to Backend)

1. **Replace Mock Data Imports**

   ```typescript
   // Current (using mock data)
   import {mockAnimals} from '@/data/dashboard-mock-data';

   // Target (using real API)
   import {listLivestockAnimals} from '@/presentation/controllers/livestock';
   ```

2. **Implement Data Fetching**

   ```typescript
   // Add proper data fetching to components
   const {data: animals} = useQuery({
     queryKey: ['livestock', farmId],
     queryFn: () => listLivestockAnimals({farmId})
   });
   ```

3. **Add State Management**
   - Implement TanStack Query for server state
   - Add loading and error states
   - Handle real-time updates

### **Medium Priority**

1. Complete crop management use cases
2. Implement weather API integration
3. Add notification system
4. Build comprehensive analytics dashboard

## 🏆 Project Strengths

- **Excellent Architecture**: Clean Architecture implementation with proper separation of concerns
- **Production-Ready Backend**: Comprehensive livestock management system exceeding original scope
- **Advanced Features**: Sophisticated vaccination scheduling and health analytics
- **Type Safety**: Full TypeScript implementation with proper validation
- **Scalable Design**: Multi-tenant architecture ready for production

## 📈 Current Capabilities

The project currently supports:

- **Multi-tenant organizations** with role-based access
- **Advanced livestock health tracking** with vaccination scheduling
- **Comprehensive inventory management** with analytics
- **Equipment maintenance tracking** with cost analysis
- **Task management** with team collaboration
- **Farm and field management** with geographic support

## 🤝 Contributing

The main contribution needed is **frontend integration**. The backend is comprehensive and production-ready - we need to connect the beautiful UI to the implemented APIs.

---

**Farm Pilot** - Transforming farm management through integrated technology solutions.
