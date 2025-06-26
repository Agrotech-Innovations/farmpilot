# Farm Pilot - Comprehensive Farm Management SaaS Platform

> **Modern SaaS application for farm management and monitoring built with Clean Architecture principles**

![Farm Pilot Dashboard](https://img.shields.io/badge/Farm%20Pilot-SaaS%20Platform-green)
![Tech Stack](https://img.shields.io/badge/Tech-React%2019%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20TailwindCSS-blue)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange)

## 🌱 Overview

Farm Pilot is a comprehensive SaaS platform designed to solve the fragmentation problem faced by small farmers who currently juggle multiple tasks using scattered tools (spreadsheets, notebooks, different apps). Our integrated solution provides a centralized system for managing all aspects of farm operations.

## ✨ Key Features

### 🔐 **Multi-Tenant Authentication & Security**

- **User Registration & Login** with email verification
- **Two-Factor Authentication (2FA)** with TOTP and backup codes
- **OAuth Support** (Google, GitHub, etc.)
- **JWT Stateless Sessions** for scalability
- **Multi-tenant architecture** with organization-based access control

### 🚜 **Integrated Farm Management**

- **Multiple Farms per Organization** with subscription-based limits
- **Farm Details Management** (location, acres, type, contact info)
- **Geographic Coordinates** support for mapping
- **Farm Type Classification** (crop, livestock, mixed, organic)

### 🌾 **Advanced Crop Management**

- **Planting & Harvest Planning** with intuitive drag-and-drop interface
- **Crop Rotation Intelligence** with family-based warnings
- **Field Management** with soil type tracking
- **Yield Tracking & Analytics** per crop/field
- **Growth Status Monitoring** (planned → planted → growing → harvested)
- **Pest & Disease Management** with early warning system
- **Soil Health Tracking** with amendment history

### 🐄 **Livestock Management** _(Coming Soon)_

- Animal health records and tracking
- Breeding schedule management
- Grazing rotation planning
- Feed and medication tracking

### 📋 **Task Management & Scheduling**

- Task assignment to farmhands
- Progress tracking and reminders
- Equipment maintenance scheduling
- Seasonal planning calendars

### 📦 **Inventory Management**

- Seeds, fertilizers, and feed tracking
- Low stock alerts and notifications
- Harvest produce inventory
- Equipment and tools management

### 📊 **Analytics & Reporting**

- Performance insights and yield analytics
- Crop rotation effectiveness analysis
- Financial tracking and profitability reports
- Weather integration for decision support

## 🏗️ Architecture

Farm Pilot follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── core/                           # Business Logic (Domain + Application)
│   ├── domain/                     # Pure business logic
│   │   ├── entities/               # Business entities
│   │   ├── repositories/           # Repository interfaces
│   │   └── value-objects/          # Domain value objects
│   └── application/                # Use cases and services
│       ├── use-cases/              # Business use cases
│       ├── services/               # Application services
│       └── dtos/                   # Data transfer objects
├── infrastructure/                 # External concerns
│   ├── repositories/               # Database implementations
│   ├── auth/                       # Authentication services
│   ├── prisma/                     # Database client
│   └── di/                         # Dependency injection
├── presentation/                   # UI and API layer
│   ├── controllers/                # API endpoints
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

- **TanStack Start Server Functions** - API endpoints
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

## 📱 User Interface

### **Dashboard Overview**

- **Modern, responsive design** with glass-morphism effects
- **Real-time statistics** showing farms, crops, equipment, and team
- **Activity feed** with recent farm updates
- **Weather integration** and pest alerts
- **Tabbed interface** for different management areas

### **Crop Management Interface**

- **Visual crop cards** showing status, planting dates, and progress
- **Drag-and-drop planning** for field assignments
- **Rotation warnings** based on crop family analysis
- **Harvest scheduling** with calendar integration

### **Farm Management**

- **Geographic mapping** with coordinate support
- **Farm type categorization** for specialized workflows
- **Acreage tracking** and field subdivision
- **Multi-farm support** with subscription-based limits

## 🗃️ Database Schema

### **Core Entities**

```sql
-- Multi-tenancy and Users
User (id, email, passwordHash, firstName, lastName, 2FA fields)
Organization (id, name, slug, subscriptionPlan, subscriptionStatus)
OrganizationMember (userId, organizationId, role)

-- Farm Management
Farm (id, organizationId, name, location, acres, farmType)
Field (id, farmId, name, acres, soilType, coordinates)

-- Crop Management
Crop (id, farmId, fieldId, name, variety, dates, status)
CropYield (id, cropId, harvestDate, quantity, quality)
CropTreatment (id, cropId, treatmentType, applicationDate)

-- Supporting Systems
Task (id, farmId, assignedTo, description, dueDate, status)
InventoryItem (id, farmId, itemType, quantity, lowStockThreshold)
Equipment (id, farmId, name, type, status, lastMaintenance)
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Coverage**

- **Domain Entities** - Business logic validation
- **Use Cases** - Application workflow testing
- **Repository Implementations** - Database interaction testing
- **API Endpoints** - Integration testing

## 🚀 Deployment

### **Production Build**

```bash
npm run build
```

### **Database Migration**

```bash
npm run db:migrate
```

### **Environment Setup**

- Configure production database (PostgreSQL recommended)
- Set up proper JWT secrets
- Configure OAuth providers
- Set up monitoring and logging

## 🎯 Business Benefits

### **For Small Farmers**

- **Centralized Management** - All farm operations in one place
- **Improved Efficiency** - Reduced time spent on administrative tasks
- **Better Decision Making** - Data-driven insights for crop planning
- **Cost Reduction** - Eliminate multiple subscription services
- **Scalability** - Grow from hobby farm to commercial operation

### **Technical Benefits**

- **Clean Architecture** - Maintainable and testable codebase
- **Type Safety** - Reduced runtime errors with TypeScript
- **Modern Tech Stack** - Future-proof technology choices
- **Scalable Design** - Multi-tenant architecture ready for growth
- **Security First** - Comprehensive authentication and authorization

## 🔄 Development Workflow

### **Adding New Features**

1. **Domain Layer** - Define entities and business rules
2. **Repository Interface** - Define data access contracts
3. **Use Cases** - Implement business logic
4. **Infrastructure** - Add database implementations
5. **Presentation** - Create API endpoints and UI components
6. **Testing** - Add comprehensive test coverage

### **Code Quality Standards**

- **ESLint** configuration for consistent code style
- **Prettier** for automatic code formatting
- **TypeScript strict mode** for type safety
- **Clean Architecture** principles enforcement
- **Comprehensive testing** requirements

## 📈 Roadmap

### **Phase 1 - Core Foundation** ✅

- Multi-tenant authentication
- Basic farm and crop management
- Clean architecture implementation

### **Phase 2 - Enhanced Features** 🚧

- Livestock management system
- Advanced task scheduling
- Weather API integration
- Mobile responsive design

### **Phase 3 - Analytics & Intelligence** 📋

- Yield prediction algorithms
- Cost-benefit analysis tools
- Market price integration
- Sustainability metrics

### **Phase 4 - Advanced Features** 🔮

- IoT sensor integration
- Drone imagery analysis
- AI-powered pest detection
- Supply chain management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Follow our coding standards
4. Add comprehensive tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discussions**: [GitHub Discussions](discussions-url)
- **Email**: support@farmpilot.com

---

**Farm Pilot** - _Cultivating Technology for Modern Agriculture_ 🌱

Built with ❤️ by the Farm Pilot Team
