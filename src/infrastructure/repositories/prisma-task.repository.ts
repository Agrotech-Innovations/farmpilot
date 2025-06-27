import {PrismaClient} from '@prisma/client';
import {Task, TaskPriority, TaskStatus} from '@/core/domain/entities';
import {TaskRepository} from '@/core/domain/repositories';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {id}
    });

    return task ? this.toDomain(task) : null;
  }

  async save(task: Task): Promise<void> {
    await this.prisma.task.upsert({
      where: {id: task.id},
      create: {
        id: task.id,
        farmId: task.farmId,
        cropId: task.cropId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedToEmail: task.assignedToEmail,
        assignedToName: task.assignedToName,
        dueDate: task.dueDate,
        scheduledDate: task.scheduledDate,
        completedDate: task.completedDate,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        category: task.category,
        tags: task.tags ? JSON.stringify(task.tags) : null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      },
      update: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedToEmail: task.assignedToEmail,
        assignedToName: task.assignedToName,
        dueDate: task.dueDate,
        scheduledDate: task.scheduledDate,
        completedDate: task.completedDate,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        category: task.category,
        tags: task.tags ? JSON.stringify(task.tags) : null,
        updatedAt: task.updatedAt
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: {id}
    });
  }

  async findByFarmId(farmId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {farmId},
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}, {createdAt: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findByCropId(cropId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {cropId},
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findByStatus(farmId: string, status: TaskStatus): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        status
      },
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findPendingTasks(farmId: string): Promise<Task[]> {
    return this.findByStatus(farmId, 'pending');
  }

  async findInProgressTasks(farmId: string): Promise<Task[]> {
    return this.findByStatus(farmId, 'in_progress');
  }

  async findCompletedTasks(farmId: string, limit = 50): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        status: 'completed'
      },
      orderBy: {completedDate: 'desc'},
      take: limit
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findByPriority(
    farmId: string,
    priority: TaskPriority
  ): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        priority
      },
      orderBy: [{dueDate: 'asc'}, {createdAt: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findHighPriorityTasks(farmId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        priority: {
          in: ['high', 'urgent']
        },
        status: {
          not: 'completed'
        }
      },
      orderBy: [{priority: 'desc'}, {dueDate: 'asc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findUrgentTasks(farmId: string): Promise<Task[]> {
    return this.findByPriority(farmId, 'urgent');
  }

  async findByAssignedEmail(email: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        assignedToEmail: email,
        status: {
          not: 'completed'
        }
      },
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findUnassignedTasks(farmId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        assignedToEmail: null,
        status: {
          not: 'completed'
        }
      },
      orderBy: [{priority: 'desc'}, {dueDate: 'asc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findOverdueTasks(farmId: string): Promise<Task[]> {
    const now = new Date();
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        dueDate: {
          lt: now
        },
        status: {
          not: 'completed'
        }
      },
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findTasksDueToday(farmId: string): Promise<Task[]> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        dueDate: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: {
          not: 'completed'
        }
      },
      orderBy: {priority: 'desc'}
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findTasksDueThisWeek(farmId: string): Promise<Task[]> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        dueDate: {
          gte: now,
          lte: weekFromNow
        },
        status: {
          not: 'completed'
        }
      },
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findTasksByDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        OR: [
          {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            scheduledDate: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      },
      orderBy: [{dueDate: 'asc'}, {scheduledDate: 'asc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findByCategory(farmId: string, category: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        category
      },
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findByTags(farmId: string, tags: string[]): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        tags: {
          contains: JSON.stringify(tags[0]) // Simplified - would need proper JSON query for multiple tags
        }
      }
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async searchTasks(
    farmId: string,
    query: string,
    limit = 50
  ): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        OR: [
          {title: {contains: query}},
          {description: {contains: query}},
          {category: {contains: query}}
        ]
      },
      take: limit,
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findTasksWithFilters(
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
  ): Promise<Task[]> {
    const where: any = {farmId};

    if (filters.status?.length) {
      where.status = {in: filters.status};
    }

    if (filters.priority?.length) {
      where.priority = {in: filters.priority};
    }

    if (filters.assignedTo) {
      where.assignedToEmail = filters.assignedTo;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom;
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: [{dueDate: 'asc'}, {priority: 'desc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async getTaskStatsByStatus(
    farmId: string
  ): Promise<{status: TaskStatus; count: number}[]> {
    const result = await this.prisma.task.groupBy({
      by: ['status'],
      where: {farmId},
      _count: {status: true}
    });

    return result.map((item) => ({
      status: item.status as TaskStatus,
      count: item._count.status
    }));
  }

  async getTaskStatsByPriority(
    farmId: string
  ): Promise<{priority: TaskPriority; count: number}[]> {
    const result = await this.prisma.task.groupBy({
      by: ['priority'],
      where: {farmId},
      _count: {priority: true}
    });

    return result.map((item) => ({
      priority: item.priority as TaskPriority,
      count: item._count.priority
    }));
  }

  async getTaskStatsByCategory(
    farmId: string
  ): Promise<{category: string; count: number}[]> {
    const result = await this.prisma.task.groupBy({
      by: ['category'],
      where: {
        farmId,
        category: {not: null}
      },
      _count: {category: true}
    });

    return result.map((item) => ({
      category: item.category!,
      count: item._count.category
    }));
  }

  async getTaskStatsByAssignee(
    farmId: string
  ): Promise<{email: string; name?: string; count: number}[]> {
    const result = await this.prisma.task.groupBy({
      by: ['assignedToEmail', 'assignedToName'],
      where: {
        farmId,
        assignedToEmail: {not: null}
      },
      _count: {assignedToEmail: true}
    });

    return result.map((item) => ({
      email: item.assignedToEmail!,
      name: item.assignedToName ?? undefined,
      count: item._count.assignedToEmail
    }));
  }

  async getAverageCompletionTime(farmId: string): Promise<number> {
    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        status: 'completed',
        completedDate: {not: null}
      },
      select: {
        createdAt: true,
        completedDate: true
      }
    });

    if (tasks.length === 0) return 0;

    const totalHours = tasks.reduce((sum, task) => {
      if (!task.completedDate) return sum;
      const diffMs = task.completedDate.getTime() - task.createdAt.getTime();
      return sum + diffMs / (1000 * 60 * 60); // Convert to hours
    }, 0);

    return totalHours / tasks.length;
  }

  async getTaskCompletionRate(farmId: string, days = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalTasks = await this.prisma.task.count({
      where: {
        farmId,
        createdAt: {gte: cutoffDate}
      }
    });

    if (totalTasks === 0) return 0;

    const completedTasks = await this.prisma.task.count({
      where: {
        farmId,
        status: 'completed',
        createdAt: {gte: cutoffDate}
      }
    });

    return (completedTasks / totalTasks) * 100;
  }

  async getOverdueTasksCount(farmId: string): Promise<number> {
    const now = new Date();
    return this.prisma.task.count({
      where: {
        farmId,
        dueDate: {lt: now},
        status: {not: 'completed'}
      }
    });
  }

  async getTaskCalendar(
    farmId: string,
    month: number,
    year: number
  ): Promise<Task[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        OR: [
          {
            dueDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            scheduledDate: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      },
      orderBy: [{dueDate: 'asc'}, {scheduledDate: 'asc'}]
    });

    return tasks.map((task) => this.toDomain(task));
  }

  async findTasksScheduledForDate(farmId: string, date: Date): Promise<Task[]> {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const tasks = await this.prisma.task.findMany({
      where: {
        farmId,
        OR: [
          {
            dueDate: {
              gte: startOfDay,
              lt: endOfDay
            }
          },
          {
            scheduledDate: {
              gte: startOfDay,
              lt: endOfDay
            }
          }
        ]
      },
      orderBy: {priority: 'desc'}
    });

    return tasks.map((task) => this.toDomain(task));
  }

  private toDomain(task: {
    id: string;
    farmId: string;
    cropId: string | null;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    assignedToEmail: string | null;
    assignedToName: string | null;
    dueDate: Date | null;
    scheduledDate: Date | null;
    completedDate: Date | null;
    estimatedHours: number | null;
    actualHours: number | null;
    category: string | null;
    tags: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    return new Task({
      id: task.id,
      farmId: task.farmId,
      cropId: task.cropId ?? undefined,
      title: task.title,
      description: task.description ?? undefined,
      priority: task.priority,
      status: task.status,
      assignedToEmail: task.assignedToEmail ?? undefined,
      assignedToName: task.assignedToName ?? undefined,
      dueDate: task.dueDate ?? undefined,
      scheduledDate: task.scheduledDate ?? undefined,
      completedDate: task.completedDate ?? undefined,
      estimatedHours: task.estimatedHours ?? undefined,
      actualHours: task.actualHours ?? undefined,
      category: task.category ?? undefined,
      tags: task.tags ? JSON.parse(task.tags) : undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  }
}
