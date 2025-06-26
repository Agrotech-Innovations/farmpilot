# Farm Pilot - Comprehensive Farm Management Platform

## Overview

Farm Pilot is a modern SaaS application for comprehensive farm management and monitoring, built with Clean Architecture principles and modern web technologies. The platform addresses the problem of small farmers juggling many tasks with fragmented tools by providing a centralized, integrated system.

## Core Features Implemented

### 🔐 Authentication & Security

- **JWT Stateless Sessions**: Secure token-based authentication
- **Two-Factor Authentication (2FA)**: TOTP support with QR codes and backup codes
- **OAuth Integration**: Support for Google and GitHub authentication
- **Password Security**: bcrypt hashing for secure password storage
- **Session Management**: Refresh token rotation and secure logout

### 🏢 Multi-Tenancy & Organization Management

- **Multiple Organizations**: Users can belong to multiple organizations
- **Role-Based Access**: Owner, admin, member, and viewer roles
- **Organization-Scoped Data**: All farm data is scoped to organizations
- **Team Collaboration**: Invite and manage team members

### 🚜 Farm Management

- **Multiple Farms per Tenant**: Support for multiple farm properties
- **Farm Profiles**: Track farm details, location, acreage, and type
- **GPS Coordinates**: Map integration for farm location tracking
- **Farm Types**: Support for crop, livestock, mixed, and organic farms

### 🌱 Crop Management & Planning

- **Crop Planning Calendar**: Intuitive drag-and-drop interface for field planning
- **Crop Rotation**: Track and plan crop rotations across seasons
- **Planting & Harvest Tracking**: Schedule and monitor planting and harvest dates
- **Field Management**: Manage multiple fields with soil type tracking
- **Yield Tracking**: Record and analyze harvest quantities per crop/field
- **Growth Stages**: Track crop status from planned to harvested

### 🐄 Livestock Management

- **Animal Records**: Individual animal tracking with tag numbers
- **Health Management**: Complete health records and vaccination tracking
- **Breeding Records**: Track breeding dates and offspring
- **Grazing Management**: Pasture rotation planning and tracking
- **Health Alerts**: Early warning system for health issues
- **Veterinary Records**: Track treatments, medications, and costs

### 📦 Inventory Management

- **Comprehensive Tracking**: Seeds, fertilizers, feed, tools, and produce
- **Stock Level Alerts**: Automatic low stock notifications
- **Expiration Tracking**: Monitor expiration dates for perishable items
- **Cost Tracking**: Unit costs and total inventory value
- **Transaction History**: Complete audit trail of inventory movements
- **Supplier Management**: Track suppliers and purchase references

### 🔧 Equipment Management

- **Equipment Registry**: Track all farm machinery and tools
- **Maintenance Scheduling**: Schedule and track routine maintenance
- **Status Monitoring**: Operational, maintenance, broken, retired status
- **Cost Tracking**: Purchase price, current value, and depreciation
- **Service Records**: Maintenance history and service providers
- **Alert System**: Notifications for upcoming maintenance

### 📋 Task Management

- **Task Assignment**: Assign tasks to team members
- **Priority Levels**: Low, medium, high, urgent priority classification
- **Status Tracking**: Pending, in progress, completed, cancelled
- **Due Dates**: Schedule and track task deadlines
- **Categories**: Organize tasks by type (planting, harvesting, maintenance)
- **Time Tracking**: Estimated vs actual hours worked

### 🔔 Pest & Disease Management

- **Early Warning System**: Integrated alerts for common pests and diseases
- **Treatment Tracking**: Record organic and sustainable solutions
- **Weather Integration**: Weather-based risk assessments
- **Treatment History**: Track effectiveness of treatments

### 🧪 Soil Health Tracking

- **Soil Test Records**: pH, nitrogen, phosphorus, potassium levels
- **Amendment Tracking**: Record soil amendments and fertilizer applications
- **Historical Analysis**: Visualize soil health trends over time
- **Recommendations**: Store and track soil improvement recommendations

### 📊 Analytics & Reporting

- **Performance Metrics**: Crop yield, livestock health, equipment efficiency
- **Financial Tracking**: Revenue, expenses, profit analysis
- **Trend Analysis**: Multi-season performance comparisons
- **Health Reports**: Livestock health rates and treatment costs
- **Inventory Analytics**: Stock turnover and consumption patterns

### 🌤️ Weather Integration

- **Real-time Weather**: Current conditions and forecasts
- **Agricultural Alerts**: Weather-based farming recommendations
- **Planning Support**: Weather-informed task scheduling

## Technical Architecture

### Frontend Stack

- **React 19.1.0**: Latest React with concurrent features
- **TanStack Start**: Full-stack React framework
- **TanStack Router**: Type-safe routing
- **TypeScript 5.8.3**: Full type safety
- **Tailwind CSS 4.1.11**: Modern styling
- **shadcn/ui**: Beautiful, accessible components
- **Radix UI**: Primitive components for complex interactions

### Backend Stack

- **TanStack Start Server Functions**: Type-safe API endpoints
- **Prisma ORM**: Database abstraction and migrations
- **SQLite**: Development database (easily upgradeable to PostgreSQL)
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing

### Code Quality & Testing

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Vitest**: Unit and integration testing
- **TypeScript**: Compile-time type checking

### Architecture Principles

- **Clean Architecture**: Clear separation of concerns
- **Domain-Driven Design**: Business logic encapsulation
- **Dependency Injection**: Modular and testable code
- **Repository Pattern**: Data access abstraction
- **Use Case Pattern**: Business logic encapsulation

## Database Schema

The platform uses a comprehensive database schema with the following main entities:

### Core Entities

- **Users**: Authentication and profile data
- **Organizations**: Multi-tenant organization structure
- **Farms**: Farm properties and details
- **Fields**: Individual field management

### Crop Management

- **Crops**: Crop planning and tracking
- **CropYields**: Harvest quantity tracking
- **CropTreatments**: Pest and disease treatments
- **SoilTests**: Soil health monitoring

### Livestock Management

- **LivestockGroups**: Animal group organization
- **LivestockAnimals**: Individual animal records
- **HealthRecords**: Veterinary and health data
- **BreedingRecords**: Breeding tracking
- **GrazingRecords**: Pasture management

### Operations Management

- **Tasks**: Work assignment and tracking
- **InventoryItems**: Stock management
- **InventoryTransactions**: Stock movements
- **Equipment**: Machinery tracking
- **MaintenanceRecords**: Equipment maintenance

## User Interface

### Modern Design System

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Dark/Light Mode**: Theme switching support
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages

### Key UI Components

- **Dashboard**: Comprehensive farm overview
- **Crop Planning Calendar**: Visual crop management
- **Livestock Health Monitor**: Animal health dashboard
- **Inventory Tracker**: Stock management interface
- **Task Board**: Kanban-style task management
- **Analytics Charts**: Performance visualization

## Security Features

### Authentication Security

- **Password Requirements**: Strong password policies
- **Session Security**: Secure JWT implementation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API rate limiting for security

### Data Security

- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Content Security Policy
- **Data Encryption**: Sensitive data encryption at rest

## Deployment & Scalability

### Production Ready

- **Environment Configuration**: Environment-based settings
- **Database Migrations**: Automated schema updates
- **Error Monitoring**: Comprehensive error tracking
- **Performance Monitoring**: Application performance insights

### Scalability Features

- **Horizontal Scaling**: Stateless architecture
- **Database Optimization**: Indexed queries and efficient schemas
- **Caching Strategy**: Redis integration ready
- **CDN Ready**: Static asset optimization

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Database**

   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secrets
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Weather API (optional)
WEATHER_API_KEY="your-weather-api-key"
```

## Contributing

The project follows Clean Architecture principles with clear separation between:

- **Domain Layer**: Pure business logic
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database, external services
- **Presentation Layer**: Controllers and UI components

All contributions should maintain this architecture and include appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and documentation, please refer to the project wiki or create an issue in the repository.
