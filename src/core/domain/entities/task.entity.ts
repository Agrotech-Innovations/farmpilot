import {BaseEntity} from './base.entity';

export interface TaskProps {
  id: string;
  farmId: string;
  cropId?: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  dueDate?: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export class Task extends BaseEntity {
  public readonly farmId: string;
  public readonly cropId?: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly priority: TaskPriority;
  public readonly status: TaskStatus;
  public readonly assignedToEmail?: string;
  public readonly assignedToName?: string;
  public readonly dueDate?: Date;
  public readonly scheduledDate?: Date;
  public readonly completedDate?: Date;
  public readonly estimatedHours?: number;
  public readonly actualHours?: number;
  public readonly category?: string;
  public readonly tags?: string[];

  constructor(props: TaskProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.title, 'Task title');

    // Validate priority
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    const priority = (props.priority as TaskPriority) ?? 'medium';
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid task priority: ${props.priority}`);
    }

    // Validate status
    const validStatuses: TaskStatus[] = [
      'pending',
      'in_progress',
      'completed',
      'cancelled'
    ];
    const status = (props.status as TaskStatus) ?? 'pending';
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid task status: ${props.status}`);
    }

    // Validate hours if provided
    if (props.estimatedHours !== undefined) {
      this.validatePositiveNumber(props.estimatedHours, 'Estimated hours');
    }
    if (props.actualHours !== undefined) {
      this.validatePositiveNumber(props.actualHours, 'Actual hours');
    }

    // Validate email if provided
    if (props.assignedToEmail && !this.validateEmail(props.assignedToEmail)) {
      throw new Error('Invalid assigned email format');
    }

    this.farmId = props.farmId;
    this.cropId = props.cropId;
    this.title = props.title;
    this.description = props.description;
    this.priority = priority;
    this.status = status;
    this.assignedToEmail = props.assignedToEmail;
    this.assignedToName = props.assignedToName;
    this.dueDate = props.dueDate;
    this.scheduledDate = props.scheduledDate;
    this.completedDate = props.completedDate;
    this.estimatedHours = props.estimatedHours;
    this.actualHours = props.actualHours;
    this.category = props.category;
    this.tags = props.tags;
  }

  public updateBasicInfo(title: string, description?: string): Task {
    this.validateRequired(title, 'Task title');

    return new Task({
      ...this.toProps(),
      title,
      description,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public setPriority(priority: TaskPriority): Task {
    return new Task({
      ...this.toProps(),
      priority,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public assignTo(email: string, name?: string): Task {
    this.validateRequired(email, 'Assigned email');
    if (!this.validateEmail(email)) {
      throw new Error('Invalid assigned email format');
    }

    return new Task({
      ...this.toProps(),
      assignedToEmail: email,
      assignedToName: name,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public unassign(): Task {
    return new Task({
      ...this.toProps(),
      assignedToEmail: undefined,
      assignedToName: undefined,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public schedule(scheduledDate: Date, dueDate?: Date): Task {
    // Validate dates
    if (dueDate && scheduledDate > dueDate) {
      throw new Error('Scheduled date cannot be after due date');
    }

    return new Task({
      ...this.toProps(),
      scheduledDate,
      dueDate,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public setDueDate(dueDate: Date): Task {
    // Validate against scheduled date
    if (this.scheduledDate && dueDate < this.scheduledDate) {
      throw new Error('Due date cannot be before scheduled date');
    }

    return new Task({
      ...this.toProps(),
      dueDate,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public startWork(): Task {
    if (this.status !== 'pending') {
      throw new Error('Can only start work on pending tasks');
    }

    return new Task({
      ...this.toProps(),
      status: 'in_progress',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public markAsCompleted(actualHours?: number): Task {
    if (this.status === 'completed') {
      throw new Error('Task is already completed');
    }

    if (actualHours !== undefined) {
      this.validatePositiveNumber(actualHours, 'Actual hours');
    }

    return new Task({
      ...this.toProps(),
      status: 'completed',
      completedDate: new Date(),
      actualHours,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public cancel(): Task {
    if (this.status === 'completed') {
      throw new Error('Cannot cancel a completed task');
    }

    return new Task({
      ...this.toProps(),
      status: 'cancelled',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public reopen(): Task {
    if (this.status !== 'completed' && this.status !== 'cancelled') {
      throw new Error('Can only reopen completed or cancelled tasks');
    }

    return new Task({
      ...this.toProps(),
      status: 'pending',
      completedDate: undefined,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateTimeEstimate(estimatedHours: number): Task {
    this.validatePositiveNumber(estimatedHours, 'Estimated hours');

    return new Task({
      ...this.toProps(),
      estimatedHours,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public addTags(newTags: string[]): Task {
    const currentTags = this.tags || [];
    const uniqueTags = Array.from(new Set([...currentTags, ...newTags]));

    return new Task({
      ...this.toProps(),
      tags: uniqueTags,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public removeTags(tagsToRemove: string[]): Task {
    const currentTags = this.tags || [];
    const filteredTags = currentTags.filter(
      (tag) => !tagsToRemove.includes(tag)
    );

    return new Task({
      ...this.toProps(),
      tags: filteredTags,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public setCategory(category: string): Task {
    return new Task({
      ...this.toProps(),
      category,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public isOverdue(): boolean {
    if (!this.dueDate || this.status === 'completed') return false;
    return new Date() > this.dueDate;
  }

  public getDaysUntilDue(): number | null {
    if (!this.dueDate) return null;

    const now = new Date();
    const timeDiff = this.dueDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  public isAssigned(): boolean {
    return !!this.assignedToEmail;
  }

  public getProgressPercentage(): number {
    if (!this.estimatedHours || !this.actualHours) return 0;
    return Math.min(100, (this.actualHours / this.estimatedHours) * 100);
  }

  public getPriorityDisplay(): string {
    switch (this.priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'urgent':
        return 'Urgent';
      default:
        return 'Medium';
    }
  }

  public getStatusDisplay(): string {
    switch (this.status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  private toProps(): TaskProps {
    return {
      id: this.id,
      farmId: this.farmId,
      cropId: this.cropId,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      assignedToEmail: this.assignedToEmail,
      assignedToName: this.assignedToName,
      dueDate: this.dueDate,
      scheduledDate: this.scheduledDate,
      completedDate: this.completedDate,
      estimatedHours: this.estimatedHours,
      actualHours: this.actualHours,
      category: this.category,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
