import {
  CounterRepository,
  UserRepository,
  FarmRepository,
  OrganizationRepository,
  FieldRepository,
  CropRepository,
  TaskRepository,
  LivestockRepository,
  InventoryRepository,
  EquipmentRepository
} from '@/core/domain/repositories';
import {
  GetCounterUseCase,
  IncrementCounterUseCase,
  RegisterUserUseCase,
  LoginUserUseCase,
  EnableTwoFactorUseCase,
  OAuthLoginUseCase,
  CreateFarmUseCase,
  GetFarmUseCase,
  ListFarmsUseCase,
  UpdateFarmUseCase,
  DeleteFarmUseCase,
  CreateCropUseCase,
  PlanCropPlantingUseCase,
  CreateFieldUseCase,
  ListFieldsUseCase,
  CreateTaskUseCase,
  ListTasksUseCase,
  UpdateTaskStatusUseCase
} from '@/core/application/use-cases';
import {
  PrismaCounterRepository,
  PrismaUserRepository,
  PrismaFarmRepository,
  PrismaOrganizationRepository,
  PrismaFieldRepository,
  PrismaCropRepository,
  PrismaTaskRepository,
  PrismaLivestockRepository,
  PrismaInventoryRepository,
  PrismaEquipmentRepository
} from '@/infrastructure/repositories';
import {prisma} from '@/infrastructure/prisma/client';

export interface Dependencies {
  // Repositories
  counterRepository: CounterRepository;
  userRepository: UserRepository;
  farmRepository: FarmRepository;
  organizationRepository: OrganizationRepository;
  fieldRepository: FieldRepository;
  cropRepository: CropRepository;
  taskRepository: TaskRepository;
  livestockRepository: LivestockRepository;
  inventoryRepository: InventoryRepository;
  equipmentRepository: EquipmentRepository;

  // Use Cases
  getCounterUseCase: GetCounterUseCase;
  incrementCounterUseCase: IncrementCounterUseCase;
  registerUserUseCase: RegisterUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  enableTwoFactorUseCase: EnableTwoFactorUseCase;
  oauthLoginUseCase: OAuthLoginUseCase;
  createFarmUseCase: CreateFarmUseCase;
  getFarmUseCase: GetFarmUseCase;
  listFarmsUseCase: ListFarmsUseCase;
  updateFarmUseCase: UpdateFarmUseCase;
  deleteFarmUseCase: DeleteFarmUseCase;
  createCropUseCase: CreateCropUseCase;
  planCropPlantingUseCase: PlanCropPlantingUseCase;
  createFieldUseCase: CreateFieldUseCase;
  listFieldsUseCase: ListFieldsUseCase;
  createTaskUseCase: CreateTaskUseCase;
  listTasksUseCase: ListTasksUseCase;
  updateTaskStatusUseCase: UpdateTaskStatusUseCase;
}

class DIContainer {
  private dependencies: Dependencies;

  constructor() {
    // Infrastructure layer - Repositories
    const counterRepository = new PrismaCounterRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);
    const organizationRepository = new PrismaOrganizationRepository(prisma);
    const farmRepository = new PrismaFarmRepository(prisma);
    const fieldRepository = new PrismaFieldRepository(prisma);
    const cropRepository = new PrismaCropRepository(prisma);
    const taskRepository = new PrismaTaskRepository(prisma);
    const livestockRepository = new PrismaLivestockRepository(prisma);
    const inventoryRepository = new PrismaInventoryRepository(prisma);
    const equipmentRepository = new PrismaEquipmentRepository(prisma);

    // Application layer - Use Cases
    const getCounterUseCase = new GetCounterUseCase(counterRepository);
    const incrementCounterUseCase = new IncrementCounterUseCase(
      counterRepository
    );

    const registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      organizationRepository
    );
    const loginUserUseCase = new LoginUserUseCase(userRepository);
    const enableTwoFactorUseCase = new EnableTwoFactorUseCase(userRepository);
    const oauthLoginUseCase = new OAuthLoginUseCase(userRepository);

    const createFarmUseCase = new CreateFarmUseCase(
      farmRepository,
      organizationRepository
    );
    const getFarmUseCase = new GetFarmUseCase(farmRepository);
    const listFarmsUseCase = new ListFarmsUseCase(farmRepository);
    const updateFarmUseCase = new UpdateFarmUseCase(farmRepository);
    const deleteFarmUseCase = new DeleteFarmUseCase(farmRepository);

    const createCropUseCase = new CreateCropUseCase(
      cropRepository,
      farmRepository
    );
    const planCropPlantingUseCase = new PlanCropPlantingUseCase(
      cropRepository,
      fieldRepository
    );

    const createFieldUseCase = new CreateFieldUseCase(
      fieldRepository,
      farmRepository
    );
    const listFieldsUseCase = new ListFieldsUseCase(
      fieldRepository,
      farmRepository
    );

    const createTaskUseCase = new CreateTaskUseCase(
      taskRepository,
      farmRepository
    );
    const listTasksUseCase = new ListTasksUseCase(
      taskRepository,
      farmRepository
    );
    const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);

    this.dependencies = {
      // Repositories
      counterRepository,
      userRepository,
      farmRepository,
      organizationRepository,
      fieldRepository,
      cropRepository,
      taskRepository,
      livestockRepository,
      inventoryRepository,
      equipmentRepository,

      // Use Cases
      getCounterUseCase,
      incrementCounterUseCase,
      registerUserUseCase,
      loginUserUseCase,
      enableTwoFactorUseCase,
      oauthLoginUseCase,
      createFarmUseCase,
      getFarmUseCase,
      listFarmsUseCase,
      updateFarmUseCase,
      deleteFarmUseCase,
      createCropUseCase,
      planCropPlantingUseCase,
      createFieldUseCase,
      listFieldsUseCase,
      createTaskUseCase,
      listTasksUseCase,
      updateTaskStatusUseCase
    };
  }

  getDependencies(): Dependencies {
    return this.dependencies;
  }

  getCounterRepository(): CounterRepository {
    return this.dependencies.counterRepository;
  }

  getCounterUseCase(): GetCounterUseCase {
    return this.dependencies.getCounterUseCase;
  }

  getIncrementCounterUseCase(): IncrementCounterUseCase {
    return this.dependencies.incrementCounterUseCase;
  }
}

export const container = new DIContainer();
