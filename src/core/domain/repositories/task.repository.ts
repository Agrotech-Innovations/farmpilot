import {Task, TaskPriority, TaskStatus} from '../entities';

export interface TaskRepository {
  // Basic CRUD operations
  getById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;

  // Farm-specific operations
  findByFarmId(farmId: string): Promise<Task[]>;
  findByCropId(cropId: string): Promise<Task[]>;

  // Status-based queries
  findByStatus(farmId: string, status: TaskStatus): Promise<Task[]>;
  findPendingTasks(farmId: string): Promise<Task[]>;
  findInProgressTasks(farmId: string): Promise<Task[]>;
  findCompletedTasks(farmId: string, limit?: number): Promise<Task[]>;

  // Priority-based queries
  findByPriority(farmId: string, priority: TaskPriority): Promise<Task[]>;
  findHighPriorityTasks(farmId: string): Promise<Task[]>;
  findUrgentTasks(farmId: string): Promise<Task[]>;

  // Assignment-based queries
  findByAssignedEmail(email: string): Promise<Task[]>;
  findUnassignedTasks(farmId: string): Promise<Task[]>;

  // Date-based queries
  findOverdueTasks(farmId: string): Promise<Task[]>;
  findTasksDueToday(farmId: string): Promise<Task[]>;
  findTasksDueThisWeek(farmId: string): Promise<Task[]>;
  findTasksByDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Task[]>;

  // Category and tag-based queries
  findByCategory(farmId: string, category: string): Promise<Task[]>;
  findByTags(farmId: string, tags: string[]): Promise<Task[]>;

  // Search and filtering
  searchTasks(farmId: string, query: string, limit?: number): Promise<Task[]>;
  findTasksWithFilters(
    farmId: string,
    filters: {
      status?: TaskStatus[];
      priority?: TaskPriority[];
      assignedTo?: string;
      category?: string;
      tags?: string[];
      dueDateFrom?: Date;
      dueDateTo?: Date;
    }
  ): Promise<Task[]>;

  // Statistics and reporting
  getTaskStatsByStatus(
    farmId: string
  ): Promise<{status: TaskStatus; count: number}[]>;
  getTaskStatsByPriority(
    farmId: string
  ): Promise<{priority: TaskPriority; count: number}[]>;
  getTaskStatsByCategory(
    farmId: string
  ): Promise<{category: string; count: number}[]>;
  getTaskStatsByAssignee(
    farmId: string
  ): Promise<{email: string; name?: string; count: number}[]>;

  // Performance metrics
  getAverageCompletionTime(farmId: string): Promise<number>; // in hours
  getTaskCompletionRate(farmId: string, days?: number): Promise<number>; // percentage
  getOverdueTasksCount(farmId: string): Promise<number>;

  // Calendar and scheduling
  getTaskCalendar(farmId: string, month: number, year: number): Promise<Task[]>;
  findTasksScheduledForDate(farmId: string, date: Date): Promise<Task[]>;
}
