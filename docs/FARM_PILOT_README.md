# Farm Pilot - Comprehensive Farm Management SaaS Platform

> **Modern SaaS application for farm management and monitoring built with Clean Architecture principles**

![Farm Pilot Dashboard](https://img.shields.io/badge/Farm%20Pilot-SaaS%20Platform-green)
![Tech Stack](https://img.shields.io/badge/Tech-React%2019%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20TailwindCSS-blue)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange)
![Implementation Status](https://img.shields.io/badge/Backend-Production%20Ready-success)
![UI Status](https://img.shields.io/badge/Frontend-Needs%20Integration-yellow)

## 🌱 Overview

Farm Pilot is a comprehensive SaaS platform designed to solve the fragmentation problem faced by small farmers who currently juggle multiple tasks using scattered tools (spreadsheets, notebooks, different apps). Our integrated solution provides a centralized system for managing all aspects of farm operations.

**Current Status**: The backend is production-ready with enterprise-level livestock management capabilities and 30+ API endpoints, but the frontend needs integration work to connect with the implemented APIs.

## ✨ Key Features

### ✅ **Fully Implemented & Production Ready**

#### 🔐 **Multi-Tenant Authentication & Security** _(Enterprise Level)_

- **User Registration & Login** with comprehensive email verification
- **Two-Factor Authentication (2FA)** with TOTP and secure backup codes
- **OAuth Support** (Google, GitHub) with extensible provider architecture
- **JWT Stateless Sessions** with access/refresh token rotation for scalability
- **Multi-tenant Organization Management** with subscription-based access control
- **Role-based Access Control** with organization-level permissions

#### 🐄 **Advanced Livestock Management System** _(Enterprise Level)_

**Status**: This is our most comprehensive feature area with sophisticated capabilities that exceed typical farm management systems.

#### Core Livestock Management - ✅ **Complete**

- **Individual Animal Tracking** with comprehensive profiles including tag numbers, breeds, genealogy
- **Multi-level Group Management** for organizing animals by species, breed, or custom criteria
- **Genealogy System** with complete mother/father tag number relationships and lineage tracking
- **Weight Monitoring** with historical tracking and health record integration
- **Age Calculation** with automatic updates based on birth dates

#### Advanced Health Management System - ✅ **Production Ready**

- **Comprehensive Health Records** supporting 5 record types:
  - Vaccination records with scheduling and compliance tracking
  - Treatment records with medication and dosage details
  - Routine checkup records with weight and status updates
  - Injury records with recovery tracking
  - Illness records with symptom and treatment documentation

- **Real-time Health Status Updates** with automatic record creation
- **Veterinary Integration** with complete professional oversight tracking
- **Cost Analysis** for all health-related expenses with budget reporting
- **Health Analytics** providing farm-wide statistics and individual animal histories

#### Enterprise Vaccination System - ✅ **Advanced Implementation**

**6 Comprehensive Use Cases** covering the complete vaccination lifecycle:

1. **Individual Vaccination Scheduling** with cost tracking and veterinary assignment
2. **Bulk Vaccination Operations** across multiple animals or entire groups with advanced filtering
3. **Recurring Vaccination Schedules** with automatic interval-based scheduling and follow-up creation
4. **Vaccination Status Tracking** throughout the complete lifecycle (scheduled → completed/rescheduled/cancelled)
5. **Priority-Based Reminder System** with intelligent prioritization (high/medium/low)
6. **Vaccination Analytics** with compliance tracking, cost analysis, and effectiveness reporting

**Advanced Features:**

- **Smart Filtering** by species, breed, age range, and health status
- **Overdue Detection** with automatic priority escalation
- **Cost Estimation** for budget planning and variance analysis
- **Auto-scheduling** of follow-up vaccinations based on veterinary protocols
- **Skip Logic** to prevent over-vaccination with recent vaccination checks

#### Breeding Management System - ✅ **Complete**

**5 Specialized Use Cases** for comprehensive breeding operations:

1. **Breeding Record Creation** with mother/father tracking and expected birth calculations
2. **Pregnancy Status Management** with lifecycle tracking (bred → confirmed → birthed/aborted)
3. **Breeding Analytics** with success rate analysis and performance metrics
4. **Overdue Pregnancy Detection** with automatic alerts for animals past expected birth dates
5. **Breeding Record Management** with complete audit trails and historical analysis

**Advanced Capabilities:**

- **Gestation Period Calculations** with species-specific defaults and overdue detection
- **Birth Outcome Tracking** with offspring count and birth weight recording
- **Breeding Performance Metrics** including success rates and average gestation periods
- **Genealogy Integration** ensuring proper lineage tracking across generations

#### Health Analytics & Reporting - ✅ **Advanced Implementation**

- **Farm-wide Health Statistics** with real-time health status breakdowns
- **Individual Animal Health Histories** with complete medical records
- **Treatment Cost Analysis** with per-animal and farm-level reporting
- **Vaccination Compliance Tracking** with upcoming and overdue alerts
- **Health Trend Analysis** with historical data visualization capabilities

### 📦 **Inventory Management** _(Production Ready)_

- **Multi-Category Tracking** (seeds, fertilizers, feed, tools, harvested produce, other)
- **Intelligent Alert System** with three alert types:
  - Low stock alerts based on configurable minimum thresholds
  - Expiration alerts for items nearing expiry dates
  - Expired item alerts for immediate action required
- **Complete Transaction Audit Trail** with purchase, usage, sale, adjustment, and waste tracking
- **Advanced Cost Analytics** including unit costs, total value, and turnover analysis
- **Supplier Management** with SKU and brand tracking for procurement optimization

### 🔧 **Equipment Management** _(Production Ready)_

- **Comprehensive Equipment Registry** for all farm machinery, tools, and vehicles
- **Intelligent Maintenance System** with:
  - Preventive maintenance scheduling
  - Service history tracking with cost analysis
  - Equipment status monitoring (operational, maintenance, broken, retired)
  - Upcoming maintenance alerts and overdue detection
- **Financial Tracking** with purchase price, depreciation, and current value calculations
- **Equipment Analytics** providing usage statistics, maintenance costs, and ROI analysis
- **Service Provider Integration** with maintenance vendor tracking and performance analysis

### 📋 **Task Management** _(Production Ready)_

- **Advanced Task Creation** with multi-level assignment and delegation
- **Priority Classification System** (low, medium, high, urgent) with automatic escalation
- **Comprehensive Status Tracking** (pending, in progress, completed, cancelled)
- **Deadline Management** with overdue detection and notification systems
- **Category Organization** (planting, harvesting, maintenance, feeding, etc.)
- **Task Analytics** including completion rates, time estimates vs. actual, and performance metrics
- **Calendar Integration** with monthly/yearly task scheduling and planning

### 🚜 **Farm & Field Management** _(Production Ready)_

- **Multi-Farm Support** with organization-based subscription limits
- **Comprehensive Farm Profiles** including:
  - Geographic coordinates for mapping integration
  - Farm type classification (crop, livestock, mixed, organic)
  - Acreage tracking and field management
  - Contact information and address management
- **Field Management System** with soil type tracking and acreage calculations
- **Geographic Integration** with coordinate-based location tracking for precision agriculture

### 🚧 **Partially Implemented**

#### 🌾 **Crop Management** _(40% Complete)_

- **Basic Crop Creation**: ✅ Create crops with varieties, planting dates, and field assignments
- **Field Assignment**: ✅ Assign crops to specific fields with acreage tracking
- **Growth Status Tracking**: ✅ Basic status progression (planned → planted → growing → harvested)
- **Crop Planning Calendar**: 🔗 UI component exists but requires API integration
- **Crop Rotation Intelligence**: 📋 Basic rotation warnings implemented, advanced algorithms needed
- **Yield Tracking**: 📋 Database schema complete, use cases need implementation

#### 📊 **Analytics & Reporting** _(80% Backend, 10% Frontend)_

- **Backend Analytics**: ✅ Comprehensive analytics use cases implemented across all domains
- **Livestock Analytics**: ✅ Health reports, vaccination analytics, and breeding metrics ready
- **Equipment Analytics**: ✅ Usage statistics, maintenance costs, and ROI analysis ready
- **Inventory Analytics**: ✅ Stock turnover, consumption patterns, and cost analysis ready
- **Dashboard Visualization**: 🔗 UI components exist but display mock data instead of real analytics

### 📋 **Planned Features** _(Not Implemented)_

#### 🌤️ **Weather Integration** _(0% Complete)_

- Real-time weather conditions and agricultural forecasts
- Weather-based task scheduling and recommendations
- Pest and disease risk assessments based on weather patterns
- Integration with major weather APIs for accurate local data

#### 🔔 **Intelligent Alert & Notification System** _(0% Complete)_

- Real-time push notifications for critical events
- Email notifications with customizable preferences
- SMS alerts for urgent situations (animal health, equipment failure)
- Notification management dashboard with alert history

#### 🧪 **Soil Health Tracking** _(Database Schema Only)_

- **Database Foundation**: ✅ Complete `SoilTest` model implemented in Prisma schema
- **Missing Implementation**: Use cases, controllers, and UI components needed
- **Planned Features**:
  - pH, nitrogen, phosphorus, potassium level tracking
  - Amendment tracking with fertilizer and lime applications
  - Historical soil health analysis with trend visualization
  - Soil improvement recommendations based on test results

#### 🔔 **Pest & Disease Management** _(0% Complete)_

- Early warning system based on weather and historical data
- Integrated pest identification with treatment recommendations
- Organic and sustainable treatment tracking with effectiveness analysis
- Weather-based risk assessments for proactive management

## 🚨 Critical Implementation Gap

### **UI-Backend Disconnection** _(URGENT)_

**Issue**: While we have a comprehensive, production-ready backend with 30+ API endpoints and advanced livestock management capabilities, the frontend currently uses mock data throughout all components.

**What Works Perfectly**:

- ✅ 50+ business use cases implemented with comprehensive validation
- ✅ 11 repository implementations with 100+ methods
- ✅ Complete API layer with Zod validation and error handling
- ✅ Advanced livestock health and vaccination systems exceeding industry standards
- ✅ Comprehensive inventory, equipment, and task management
- ✅ Multi-tenant authentication with 2FA and OAuth

**What Needs Immediate Attention**:

- 🔗 Replace all mock data imports with real API calls
- 🔗 Implement TanStack Query for proper state management and data fetching
- 🔗 Connect dashboard metrics to real farm data from analytics use cases
- 🔗 Add proper loading states and error handling for all API interactions
- 🔗 Update component props to handle real data structures

**Priority Actions Required**:

1. **State Management Setup**: Configure TanStack Query for server state management
2. **API Integration**: Replace mock data with server function calls in all components
3. **Loading States**: Implement proper loading and error states for better UX
4. **Data Validation**: Ensure frontend handles all API response structures correctly

## 🏗️ Architecture

Farm Pilot follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── core/                           # Business Logic (Domain + Application)
│   ├── domain/                     # Pure business logic
│   │   ├── entities/               # 10+ business entities with rich domain logic
│   │   ├── repositories/           # Repository interfaces for all domains
│   │   └── value-objects/          # Domain value objects and enums
│   └── application/                # Use cases and services
│       ├── use-cases/              # 50+ business use cases organized by domain
│       ├── services/               # Application services for cross-cutting concerns
│       └── dtos/                   # Data transfer objects for API communication
├── infrastructure/                 # External concerns
│   ├── repositories/               # 11 Prisma repository implementations
│   ├── auth/                       # JWT and OAuth authentication services
│   ├── prisma/                     # Database client and configurations
│   └── di/                         # Dependency injection container
├── presentation/                   # UI and API layer
│   ├── controllers/                # 30+ API endpoints with comprehensive validation
│   └── components/                 # React components organized by feature
└── routes/                         # File-based routing with TanStack Router
```

### 🔄 **Dependency Flow**

- **Presentation** → **Application** → **Domain**
- **Infrastructure** can depend on **Domain** and **Application**
- **Domain** layer has no external dependencies
- Dependency injection ensures testability and modularity

## 🛠️ Tech Stack

### **Frontend & Framework**

- **React 19.1.0** - Latest React with concurrent features and server components
- **TanStack Start** - Full-stack React framework with server functions
- **TanStack Router** - Type-safe file-based routing with nested layouts
- **TypeScript 5.8.3** - Static type checking with strict mode enabled

### **Styling & UI**

- **Tailwind CSS 4.1.11** - Utility-first CSS framework with custom color system
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Primitive components for complex interactions
- **Lucide React** - Beautiful, customizable icon library

### **Backend & Database**

- **TanStack Start Server Functions** - Type-safe server-side API endpoints
- **Prisma ORM** - Type-safe database toolkit with automatic migrations
- **SQLite** - Lightweight, file-based database for development
- **Zod** - Runtime type validation for API endpoints

### **Development & Testing**

- **Vite 7.0.0** - Lightning-fast build tool with HMR
- **Vitest** - Fast unit testing framework with Jest compatibility
- **ESLint** - Comprehensive code linting with React and TypeScript presets
- **Prettier** - Consistent code formatting

### **Authentication & Security**

- **JWT** - Stateless authentication with access/refresh token rotation
- **bcrypt** - Secure password hashing with configurable rounds
- **TOTP** - Time-based one-time passwords for 2FA
- **OAuth 2.0** - Third-party authentication integration

## 📊 **Implementation Statistics**

### **Backend Completeness**

- **Use Cases**: 50+ implemented across 8 major domains
- **API Endpoints**: 30+ server functions with comprehensive validation
- **Repository Methods**: 100+ data access methods with proper error handling
- **Database Tables**: 20+ tables with proper relationships and constraints
- **Business Logic**: Rich domain entities with validation and business rules

### **Feature Coverage by Domain**

- **Livestock Management**: 95% complete (exceeds industry standards)
- **Equipment Management**: 90% complete with advanced analytics
- **Inventory Management**: 90% complete with intelligent alerts
- **Task Management**: 85% complete with calendar integration
- **Authentication & Security**: 95% complete with enterprise features
- **Farm Management**: 90% complete with multi-tenant support
- **Crop Management**: 40% complete (basic CRUD, advanced features needed)
- **Analytics**: 80% backend implemented, 10% frontend connected

### **Code Quality Metrics**

- **Type Safety**: 100% TypeScript coverage with strict mode
- **Test Coverage**: Unit tests for all critical business logic
- **Architecture Compliance**: Clean Architecture principles followed throughout
- **API Documentation**: Comprehensive documentation for all 30+ endpoints

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm**

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Agrotech-Innovations/farmpilot.git
   cd farmpilot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # JWT Configuration
   JWT_ACCESS_SECRET="your-super-secure-access-secret"
   JWT_REFRESH_SECRET="your-super-secure-refresh-secret"
   JWT_ACCESS_EXPIRY="15m"
   JWT_REFRESH_EXPIRY="7d"

   # OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # 2FA Configuration
   TOTP_SERVICE_NAME="Farm Pilot"
   TOTP_ISSUER="Agrotech Innovations"

   # Weather API (Planned)
   WEATHER_API_KEY="your-weather-api-key"
   ```

4. **Set up the database:**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Create database and apply schema
   npm run db:push

   # Optional: Open Prisma Studio to view data
   npm run db:studio
   ```

### **Development**

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Format code
npm run format
```

## 🔗 **API Documentation**

The application provides 30+ comprehensive API endpoints organized by domain:

- **Authentication**: User registration, login, 2FA setup, OAuth integration
- **Farm Management**: CRUD operations for farms and fields
- **Livestock Management**: 15+ endpoints for animals, health, breeding, and vaccinations
- **Equipment Management**: Equipment tracking, maintenance scheduling, and analytics
- **Inventory Management**: Item tracking, transactions, and intelligent alerts
- **Task Management**: Task creation, assignment, and progress tracking
- **Crop Management**: Basic crop operations and field assignments

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 📋 **Next Steps for Implementation**

### **Immediate Priority (Frontend Integration)**

1. **Setup TanStack Query**: Configure proper server state management
2. **Replace Mock Data**: Connect all UI components to existing APIs
3. **Add Loading States**: Implement proper loading and error handling
4. **Data Validation**: Ensure frontend handles all API response structures

### **Medium Priority (Complete Features)**

1. **Soil Health Implementation**: Add missing use cases for existing database schema
2. **Crop Yield Tracking**: Implement yield recording and analysis features
3. **Advanced Analytics Dashboard**: Build comprehensive reporting interface
4. **Notification System**: Real-time alerts and notifications

### **Future Enhancements**

1. **Weather Integration**: Add weather API and agricultural alerts
2. **Pest & Disease Management**: Comprehensive tracking and treatment system
3. **Mobile App**: React Native application for field workers
4. **Advanced Analytics**: Machine learning for predictive insights

## 🤝 **Contributing**

The project follows Clean Architecture principles with clear separation between:

- **Domain Layer**: Pure business logic with no external dependencies
- **Application Layer**: Use cases orchestrating business operations
- **Infrastructure Layer**: Database access, external services, and technical concerns
- **Presentation Layer**: API controllers and UI components

All contributions should maintain this architecture and include appropriate tests.

## 📄 **License**

This project is proprietary software developed by Agrotech Innovations. All rights reserved.

---

**Farm Pilot** - Revolutionizing farm management through integrated technology solutions.
