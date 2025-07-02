# Prisma Schema Organization

This directory contains the Prisma schema files organized in a modular structure for better maintainability.

## File Structure

### Main Schema

- **`schema.prisma`** - Clean configuration file with generator and datasource settings. Models are kept in separate domain files to avoid duplication.

### Modular Schema Files

The schema has been logically separated into the following domain-specific files:

#### Core Infrastructure

- **`auth.prisma`** - Authentication and multi-tenancy models
  - `User` - User accounts with authentication details
  - `OAuthProvider` - OAuth integration (Google, GitHub, etc.)
  - `Organization` - Multi-tenant organizations
  - `OrganizationMember` - User-organization relationships

#### Farm Management

- **`farm.prisma`** - Core farm entities
  - `Farm` - Main farm entity
  - `Field` - Farm field/plot management

#### Agricultural Operations

- **`crop.prisma`** - Crop management models
  - `Crop` - Crop planning and tracking
  - `CropYield` - Harvest yield records
  - `CropTreatment` - Fertilizers, pesticides, etc.
  - `SoilTest` - Soil analysis records

- **`livestock.prisma`** - Livestock management models
  - `LivestockGroup` - Groups/herds of animals
  - `LivestockAnimal` - Individual animal records
  - `HealthRecord` - Veterinary and health records
  - `BreedingRecord` - Breeding and pregnancy tracking
  - `GrazingRecord` - Pasture and grazing management

#### Operations & Resources

- **`task.prisma`** - Task management models
  - `Task` - Farm task planning and tracking

- **`inventory.prisma`** - Inventory management models
  - `InventoryItem` - Seeds, fertilizers, feed, tools, etc.
  - `InventoryTransaction` - Purchase, usage, sales tracking

- **`equipment.prisma`** - Equipment management models
  - `Equipment` - Farm machinery and tools
  - `MaintenanceRecord` - Equipment maintenance tracking

#### Legacy

- **`legacy.prisma`** - Backward compatibility models
  - `Counter` - Legacy counter model (to be deprecated)

## Working with Modular Schemas

### Current Approach

Since Prisma doesn't natively support file imports, we maintain:

1. **Individual domain files** containing organized models by domain
2. **Clean main `schema.prisma`** with only configuration (no duplicate models)
3. **Temporary workflow** for Prisma CLI operations

### Development Workflow

1. **Edit individual files** (`auth.prisma`, `farm.prisma`, etc.) for focused development
2. **When using Prisma CLI**: Temporarily copy needed models into main `schema.prisma`
3. **Run Prisma commands** (generate, migrate, etc.)
4. **Clean up**: Remove copied models from main schema to keep it clean

### Helper Script (Recommended)

Use the provided `combine-schemas.sh` script for easier workflow:

```bash
# 1. Combine all domain schemas
./combine-schemas.sh combine

# 2. Run Prisma commands
npx prisma generate
npx prisma db push

# 3. Restore clean schema
./combine-schemas.sh clean
```

### Manual Workflow

```bash
# 1. Copy models from domain files to main schema
cat auth.prisma farm.prisma crop.prisma livestock.prisma task.prisma inventory.prisma equipment.prisma legacy.prisma >> schema.prisma

# 2. Run Prisma commands
npx prisma generate
npx prisma db push

# 3. Remove models from main schema (keep only config)
git checkout schema.prisma  # or manually remove models
```

### Prisma Commands

All Prisma CLI commands should be run against the main schema:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma db push
npx prisma migrate dev

# Reset database
npx prisma db push --force-reset

# Open Prisma Studio
npx prisma studio
```

## Benefits of This Organization

### ✅ Maintainability

- **Domain separation** - Easy to find and modify related models
- **Reduced cognitive load** - Work on specific domains without seeing unrelated models
- **Clear boundaries** - Well-defined separation of concerns

### ✅ Team Collaboration

- **Focused PRs** - Changes are easier to review when scoped to specific domains
- **Parallel development** - Multiple developers can work on different domains
- **Expertise alignment** - Domain experts can focus on relevant schema sections

### ✅ Documentation

- **Self-documenting** - File names clearly indicate content
- **Domain context** - Related models are grouped together
- **Comments preserved** - Each file contains relevant domain-specific documentation

## Schema Relationships

The models are interconnected across domains:

```
Organization → Farm → Fields, Crops, Livestock, Equipment, Inventory, Tasks
User → Organization (many-to-many)
Farm → All farm-specific entities
Field → Crops, SoilTests
Crop → Tasks, Yields, Treatments
LivestockGroup → Animals → HealthRecords, BreedingRecords
```

## Future Improvements

1. **Prisma Schema Imports** - When Prisma supports file imports, we can use the modular files directly
2. **Build Process** - Automated merging of individual files into main schema
3. **Validation** - Cross-file relationship validation
4. **Code Generation** - Generate TypeScript types per domain

## Migration from Monolithic Schema

This organization was created by splitting a large monolithic schema into focused domain files while maintaining full backward compatibility. All existing migrations and database structures remain unchanged.
