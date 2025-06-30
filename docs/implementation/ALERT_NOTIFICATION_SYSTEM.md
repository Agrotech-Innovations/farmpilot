# Alert & Notification System Implementation

## Overview

Farm Pilot implements an intelligent alert and notification system that proactively monitors farm operations and notifies users of critical events, upcoming tasks, and system issues. The system is designed to prevent problems before they occur and ensure optimal farm management.

## 🚨 **Current Implementation Status**

### ✅ **Fully Implemented Alert Types**

#### **Inventory Alerts** _(Production Ready)_

- **Low Stock Alerts**: Automatic detection when inventory falls below minimum thresholds
- **Expiration Alerts**: Upcoming expiration warnings for perishable items
- **Expired Item Alerts**: Immediate alerts for expired inventory requiring action

#### **Equipment Alerts** _(Production Ready)_

- **Maintenance Due Alerts**: Equipment requiring scheduled maintenance
- **Upcoming Maintenance**: Preventive maintenance reminders
- **Equipment Status Alerts**: Broken or non-operational equipment notifications

#### **Livestock Health Alerts** _(Advanced Implementation)_

- **Vaccination Reminders**: Priority-based vaccination scheduling alerts
- **Health Status Alerts**: Animals requiring medical attention
- **Breeding Alerts**: Overdue pregnancies and upcoming births
- **Treatment Reminders**: Follow-up treatments and checkups

### 🔗 **UI Components Ready (Needs Backend Integration)**

- **Alert Card Component**: Styled alert display with severity levels
- **Alerts & Weather Widget**: Dashboard widget for displaying alerts
- **Alert Types**: Support for pest, health, weather, and inventory alert types

### 📋 **Planned Features (Not Implemented)**

- **Real-time Push Notifications**: Browser and mobile push notifications
- **Email Notifications**: Customizable email alerts
- **SMS Notifications**: Critical alerts via SMS
- **Notification Preferences**: User-configurable alert settings

## 🏗️ **Alert System Architecture**

### **Alert Generation Pipeline**

```
┌─────────────────────────────────────────────────────────────┐
│                    Alert Generation                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Scheduled   │ │ Event-Based │ │ Real-time   │           │
│  │ Checks      │ │ Triggers    │ │ Monitoring  │           │
│  │ (Cron Jobs) │ │ (Webhooks)  │ │ (Polling)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                  Alert Processing                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Validation  │ │ Priority    │ │ Deduplication│          │
│  │ & Filtering │ │ Assignment  │ │ & Grouping  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                  Notification Delivery                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ In-App      │ │ Email       │ │ SMS/Push    │           │
│  │ Alerts      │ │ Notifications│ │ Notifications│          │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### **Alert Data Model**

```typescript
interface Alert {
  id: string;
  organizationId: string; // Multi-tenant isolation
  farmId?: string; // Optional farm-specific alerts
  type: AlertType; // Category of alert
  severity: AlertSeverity; // Priority level
  title: string; // Short alert title
  description: string; // Detailed alert description
  source: AlertSource; // What generated the alert
  sourceId: string; // ID of the source entity
  status: AlertStatus; // Current alert state

  // Scheduling
  triggeredAt: Date; // When alert was generated
  dismissedAt?: Date; // When user dismissed alert
  resolvedAt?: Date; // When issue was resolved
  expiresAt?: Date; // Auto-expire timestamp

  // User interaction
  dismissedBy?: string; // User who dismissed alert
  resolvedBy?: string; // User who resolved alert
  notes?: string; // User notes on resolution

  // Metadata
  metadata: Record<string, any>; // Additional context data
  createdAt: Date;
  updatedAt: Date;
}

type AlertType =
  | 'livestock_health'
  | 'livestock_vaccination'
  | 'livestock_breeding'
  | 'inventory_low_stock'
  | 'inventory_expired'
  | 'inventory_expiring'
  | 'equipment_maintenance'
  | 'equipment_broken'
  | 'task_overdue'
  | 'task_due_soon'
  | 'weather_warning'
  | 'pest_detection'
  | 'system_error';

type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

type AlertSource =
  | 'livestock_monitoring'
  | 'inventory_tracking'
  | 'equipment_monitoring'
  | 'task_scheduler'
  | 'weather_service'
  | 'user_report'
  | 'system_check';

type AlertStatus = 'active' | 'dismissed' | 'resolved' | 'expired';
```

## 📊 **Implemented Alert Use Cases**

### **1. Inventory Alert System**

#### **GetInventoryAlertsUseCase** _(Fully Implemented)_

```typescript
export class GetInventoryAlertsUseCase {
  async execute(
    request: GetInventoryAlertsRequest
  ): Promise<GetInventoryAlertsResponse> {
    const [lowStockItems, expiredItems, expiringSoonItems] = await Promise.all([
      this.inventoryRepository.findLowStockItems(request.farmId),
      this.inventoryRepository.findExpiredItems(request.farmId),
      this.inventoryRepository.findExpiringSoonItems(
        request.farmId,
        request.expirationDaysAhead || 7
      )
    ]);

    return {
      lowStockItems,
      expiredItems,
      expiringSoonItems
    };
  }
}
```

**Alert Generation Logic:**

- **Low Stock**: `currentQuantity <= minimumQuantity`
- **Expired**: `expirationDate < currentDate`
- **Expiring Soon**: `expirationDate <= currentDate + daysAhead`

### **2. Equipment Alert System**

#### **Equipment Maintenance Alerts** _(Fully Implemented)_

```typescript
export class GetEquipmentAlertsUseCase {
  async execute(farmId: string): Promise<EquipmentAlerts> {
    const [needingMaintenance, upcomingMaintenance, brokenEquipment] =
      await Promise.all([
        this.equipmentRepository.findEquipmentNeedingMaintenance(farmId),
        this.equipmentRepository.findUpcomingMaintenance(farmId, 30),
        this.equipmentRepository.findBrokenEquipment(farmId)
      ]);

    return {
      needingMaintenance,
      upcomingMaintenance,
      brokenEquipment
    };
  }
}
```

**Alert Triggers:**

- **Maintenance Due**: `nextServiceDate <= currentDate`
- **Upcoming Maintenance**: `nextServiceDate <= currentDate + 30 days`
- **Equipment Broken**: `status === 'broken' || status === 'maintenance'`

### **3. Livestock Health Alert System**

#### **Vaccination Reminder System** _(Advanced Implementation)_

```typescript
export class GetVaccinationRemindersUseCase {
  async execute(
    request: GetVaccinationRemindersRequest
  ): Promise<VaccinationRemindersResponse> {
    // Get all vaccination records for farm
    const vaccinationRecords = await this.getVaccinationRecords(request.farmId);

    const reminders: VaccinationReminder[] = [];
    const now = new Date();

    for (const record of vaccinationRecords) {
      const daysUntilDue = this.calculateDaysUntilDue(
        record.scheduledDate,
        now
      );
      const priority = this.calculatePriority(record, daysUntilDue);

      if (this.shouldCreateReminder(daysUntilDue, priority, request)) {
        reminders.push({
          id: record.id,
          animalId: record.animalId,
          vaccinationType: record.description,
          scheduledDate: record.scheduledDate,
          daysUntilDue,
          priority,
          estimatedCost: record.cost
        });
      }
    }

    return {
      upcomingVaccinations: reminders.filter((r) => r.daysUntilDue > 0),
      dueSoonVaccinations: reminders.filter(
        (r) => r.daysUntilDue <= 7 && r.daysUntilDue >= 0
      ),
      overdueVaccinations: reminders.filter((r) => r.daysUntilDue < 0),
      totalEstimatedCost: reminders.reduce(
        (sum, r) => sum + (r.estimatedCost || 0),
        0
      )
    };
  }

  private calculatePriority(
    record: HealthRecord,
    daysUntilDue: number
  ): 'high' | 'medium' | 'low' {
    // Critical vaccinations (rabies, core vaccines)
    const criticalVaccinations = ['rabies', 'distemper', 'hepatitis'];
    const isCritical = criticalVaccinations.some((vaccine) =>
      record.description.toLowerCase().includes(vaccine)
    );

    if (daysUntilDue < 0) return 'high'; // Overdue
    if (isCritical && daysUntilDue <= 7) return 'high'; // Critical due soon
    if (daysUntilDue <= 3) return 'high'; // Due very soon
    if (daysUntilDue <= 7) return 'medium'; // Due soon
    return 'low'; // Future vaccination
  }
}
```

#### **Breeding Alert System** _(Fully Implemented)_

```typescript
export class GetBreedingAlertsUseCase {
  async execute(farmId: string): Promise<BreedingAlerts> {
    const [overduePregnancies, upcomingBirths, activePregnancies] =
      await Promise.all([
        this.livestockRepository.findOverduePregnancies(farmId),
        this.livestockRepository.findUpcomingBirths(farmId, 14), // Next 2 weeks
        this.livestockRepository.findActivePregnancies(farmId)
      ]);

    return {
      overduePregnancies: overduePregnancies.map((breeding) => ({
        id: breeding.id,
        motherAnimalId: breeding.motherAnimalId,
        expectedBirthDate: breeding.expectedBirthDate,
        daysOverdue: this.calculateDaysOverdue(breeding.expectedBirthDate),
        priority: 'high'
      })),

      upcomingBirths: upcomingBirths.map((breeding) => ({
        id: breeding.id,
        motherAnimalId: breeding.motherAnimalId,
        expectedBirthDate: breeding.expectedBirthDate,
        daysUntilBirth: this.calculateDaysUntilBirth(
          breeding.expectedBirthDate
        ),
        priority: 'medium'
      })),

      totalActivePregnancies: activePregnancies.length
    };
  }
}
```

## 🎨 **UI Components Implementation**

### **Alert Card Component** _(Fully Implemented)_

```typescript
export function AlertCard({
  type,
  title,
  description,
  icon: Icon,
  severity,
  className = ''
}: AlertCardProps) {
  const getBorderClass = () => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'border-destructive';
      case 'medium':
        return 'border-chart-5';
      case 'low':
      default:
        return 'border-border';
    }
  };

  const getIconColor = () => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'text-destructive';
      case 'medium':
        return 'text-chart-5';
      case 'low':
      default:
        return 'text-chart-4';
    }
  };

  return (
    <div className={`p-4 bg-secondary border ${getBorderClass()} rounded-lg ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${getIconColor()}`} />
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

### **Alerts & Weather Widget** _(UI Ready, Needs Backend Integration)_

```typescript
export function AlertsWeather({
  alerts,
  weather,
  className = ''
}: AlertsWeatherProps) {
  return (
    <Card className={`bg-card/70 backdrop-blur-sm ${className}`}>
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
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            type={alert.type}
            title={alert.title}
            description={alert.description}
            icon={alert.icon}
            severity={alert.severity}
          />
        ))}

        {weather && (
          <WeatherDisplay weather={weather} />
        )}
      </CardContent>
    </Card>
  );
}
```

## 🔔 **Notification System Design**

### **Notification Preferences** _(Planned Implementation)_

```typescript
interface NotificationPreferences {
  userId: string;
  organizationId: string;

  // Channel preferences
  enableInApp: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  enablePush: boolean;

  // Alert type preferences
  livestockHealthAlerts: NotificationSettings;
  inventoryAlerts: NotificationSettings;
  equipmentAlerts: NotificationSettings;
  taskReminders: NotificationSettings;
  weatherAlerts: NotificationSettings;

  // Delivery preferences
  emailDigestFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "06:00"
  };

  // Emergency overrides
  criticalAlertsOverride: boolean; // Always notify for critical alerts
}

interface NotificationSettings {
  enabled: boolean;
  minimumSeverity: AlertSeverity;
  channels: ('in_app' | 'email' | 'sms' | 'push')[];
}
```

### **Notification Delivery Service** _(Planned Implementation)_

```typescript
export class NotificationDeliveryService {
  async sendNotification(alert: Alert, recipients: User[]): Promise<void> {
    for (const user of recipients) {
      const preferences = await this.getNotificationPreferences(user.id);

      if (!this.shouldSendNotification(alert, preferences)) {
        continue;
      }

      const channels = this.determineChannels(alert, preferences);

      await Promise.all([
        this.sendInAppNotification(alert, user, channels.includes('in_app')),
        this.sendEmailNotification(alert, user, channels.includes('email')),
        this.sendSMSNotification(alert, user, channels.includes('sms')),
        this.sendPushNotification(alert, user, channels.includes('push'))
      ]);
    }
  }

  private shouldSendNotification(
    alert: Alert,
    preferences: NotificationPreferences
  ): boolean {
    // Check if notification type is enabled
    const settings = this.getSettingsForAlertType(alert.type, preferences);
    if (!settings.enabled) return false;

    // Check severity threshold
    if (
      !this.meetsSeverityThreshold(alert.severity, settings.minimumSeverity)
    ) {
      return false;
    }

    // Check quiet hours (except for critical alerts)
    if (alert.severity !== 'critical' && this.isDuringQuietHours(preferences)) {
      return false;
    }

    return true;
  }
}
```

## 📱 **Real-Time Alert System** _(Planned Implementation)_

### **WebSocket Integration**

```typescript
export class RealTimeAlertService {
  private websocketConnections = new Map<string, WebSocket>();

  async broadcastAlert(alert: Alert): Promise<void> {
    // Get all connected users for the organization
    const connections = this.getOrganizationConnections(alert.organizationId);

    const alertPayload = {
      type: 'alert',
      data: {
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        triggeredAt: alert.triggeredAt
      }
    };

    // Broadcast to all connected clients
    connections.forEach((connection) => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(alertPayload));
      }
    });
  }

  async subscribeToAlerts(
    userId: string,
    organizationId: string,
    ws: WebSocket
  ): Promise<void> {
    const connectionKey = `${organizationId}:${userId}`;
    this.websocketConnections.set(connectionKey, ws);

    // Send any pending alerts for this user
    const pendingAlerts = await this.getPendingAlerts(userId, organizationId);
    for (const alert of pendingAlerts) {
      await this.sendAlertToConnection(alert, ws);
    }
  }
}
```

### **Push Notification Integration**

```typescript
export class PushNotificationService {
  private vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
  };

  async sendPushNotification(alert: Alert, user: User): Promise<void> {
    const subscriptions = await this.getUserPushSubscriptions(user.id);

    const payload = {
      title: alert.title,
      body: alert.description,
      icon: '/icons/alert-icon.png',
      badge: '/icons/badge-icon.png',
      data: {
        alertId: alert.id,
        type: alert.type,
        severity: alert.severity,
        url: `/dashboard/alerts/${alert.id}`
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    const promises = subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, JSON.stringify(payload), {
        vapidDetails: {
          subject: 'mailto:support@farmpilot.com',
          publicKey: this.vapidKeys.publicKey,
          privateKey: this.vapidKeys.privateKey
        }
      })
    );

    await Promise.all(promises);
  }
}
```

## 🤖 **Automated Alert Processing**

### **Alert Aggregation & Deduplication**

```typescript
export class AlertAggregationService {
  async processNewAlert(alert: Alert): Promise<void> {
    // Check for similar recent alerts
    const similarAlerts = await this.findSimilarAlerts(alert);

    if (similarAlerts.length > 0) {
      // Update existing alert instead of creating new one
      await this.updateExistingAlert(similarAlerts[0], alert);
    } else {
      // Create new alert
      await this.createNewAlert(alert);
    }
  }

  private async findSimilarAlerts(alert: Alert): Promise<Alert[]> {
    const timeWindow = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

    return this.alertRepository.findSimilar({
      organizationId: alert.organizationId,
      type: alert.type,
      sourceId: alert.sourceId,
      status: 'active',
      triggeredAfter: timeWindow
    });
  }
}
```

### **Scheduled Alert Processing**

```typescript
export class ScheduledAlertProcessor {
  // Run every hour to check for new alerts
  @Cron('0 * * * *')
  async processScheduledAlerts(): Promise<void> {
    await Promise.all([
      this.processInventoryAlerts(),
      this.processEquipmentAlerts(),
      this.processLivestockAlerts(),
      this.processTaskAlerts()
    ]);
  }

  private async processInventoryAlerts(): Promise<void> {
    const organizations = await this.organizationRepository.findActive();

    for (const org of organizations) {
      const farms = await this.farmRepository.findByOrganization(org.id);

      for (const farm of farms) {
        const alerts = await this.getInventoryAlertsUseCase.execute({
          farmId: farm.id,
          expirationDaysAhead: 7
        });

        await this.createAlertsFromInventoryIssues(farm, alerts);
      }
    }
  }
}
```

## 📊 **Alert Analytics & Reporting**

### **Alert Metrics Dashboard**

```typescript
export class AlertAnalyticsUseCase {
  async getAlertMetrics(
    organizationId: string,
    timeRange: TimeRange
  ): Promise<AlertMetrics> {
    const alerts = await this.alertRepository.findByOrganizationAndTimeRange(
      organizationId,
      timeRange
    );

    return {
      totalAlerts: alerts.length,
      alertsByType: this.groupAlertsByType(alerts),
      alertsBySeverity: this.groupAlertsBySeverity(alerts),
      averageResolutionTime: this.calculateAverageResolutionTime(alerts),
      alertTrends: this.calculateAlertTrends(alerts, timeRange),
      topAlertSources: this.getTopAlertSources(alerts),
      responseMetrics: {
        averageAcknowledgmentTime:
          this.calculateAverageAcknowledgmentTime(alerts),
        resolutionRate: this.calculateResolutionRate(alerts),
        dismissalRate: this.calculateDismissalRate(alerts)
      }
    };
  }
}
```

## 🎯 **Implementation Roadmap**

### **Phase 1: Enhanced Backend Integration** _(Immediate)_

1. **Connect UI Components**: Wire existing alert components to backend APIs
2. **Real-time Updates**: Implement WebSocket connections for live alerts
3. **Alert Management**: Add dismiss, resolve, and snooze functionality
4. **Alert History**: Implement alert history and tracking

### **Phase 2: Notification Delivery** _(Medium Priority)_

1. **Email Notifications**: SMTP integration for email alerts
2. **Push Notifications**: Browser push notification support
3. **SMS Integration**: Twilio integration for critical alerts
4. **Notification Preferences**: User preference management

### **Phase 3: Advanced Features** _(Future)_

1. **Machine Learning**: Predictive alerts based on historical data
2. **Custom Alert Rules**: User-configurable alert conditions
3. **Third-party Integrations**: Weather APIs, IoT sensors
4. **Mobile App**: React Native app with push notifications

## 🔧 **Configuration & Customization**

### **Alert Rule Engine** _(Planned)_

```typescript
interface AlertRule {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isActive: boolean;

  // Trigger conditions
  conditions: AlertCondition[];
  triggerOperator: 'AND' | 'OR';

  // Alert properties
  severity: AlertSeverity;
  message: string;

  // Notification settings
  notificationChannels: ('in_app' | 'email' | 'sms' | 'push')[];
  recipients: string[]; // User IDs

  // Scheduling
  cooldownPeriod: number; // Minutes between repeated alerts
  activeHours?: {
    start: string;
    end: string;
  };
}

interface AlertCondition {
  field: string; // e.g., 'inventory.currentQuantity'
  operator: ComparisonOperator;
  value: any;
  description: string;
}
```

This comprehensive alert and notification system provides the foundation for proactive farm management, ensuring that critical issues are identified and addressed promptly while reducing manual monitoring overhead.
