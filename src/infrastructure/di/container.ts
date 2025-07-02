import {
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
  GetTaskUseCase,
  ListTasksUseCase,
  UpdateTaskStatusUseCase,
  CreateLivestockGroupUseCase,
  AddLivestockAnimalUseCase,
  ListAnimalsByFarmUseCase,
  CreateHealthRecordUseCase,
  GetHealthRecordsUseCase,
  UpdateAnimalHealthStatusUseCase,
  ScheduleVaccinationUseCase,
  CreateVaccinationScheduleUseCase,
  GetVaccinationScheduleUseCase,
  UpdateVaccinationStatusUseCase,
  GetVaccinationRemindersUseCase,
  BulkScheduleVaccinationsUseCase,
  GetLivestockHealthAnalyticsUseCase,
  RecordTreatmentUseCase,
  GetAnimalHealthHistoryUseCase,
  UpdateAnimalWeightUseCase,
  CreateBreedingRecordUseCase,
  UpdatePregnancyStatusUseCase,
  GetBreedingRecordsUseCase,
  GetBreedingAnalyticsUseCase,
  DeleteBreedingRecordUseCase,
  CreateInventoryItemUseCase,
  RecordInventoryTransactionUseCase,
  GetInventoryItemUseCase,
  ListInventoryItemsUseCase,
  UpdateInventoryItemUseCase,
  DeleteInventoryItemUseCase,
  GetInventoryAlertsUseCase,
  GetInventoryAnalyticsUseCase,
  GetInventoryTransactionsUseCase,
  CreateEquipmentUseCase,
  ScheduleMaintenanceUseCase,
  ListEquipmentUseCase,
  GetEquipmentUseCase,
  UpdateEquipmentUseCase,
  DeleteEquipmentUseCase,
  GetMaintenanceRecordsUseCase,
  GetEquipmentAnalyticsUseCase
} from '@/core/application/use-cases';
import {
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
import {JwtService} from '@/infrastructure/auth/jwt.service';
import {prisma} from '@/infrastructure/prisma/client';

export interface Dependencies {
  // Repositories
  userRepository: UserRepository;
  farmRepository: FarmRepository;
  organizationRepository: OrganizationRepository;
  fieldRepository: FieldRepository;
  cropRepository: CropRepository;
  taskRepository: TaskRepository;
  livestockRepository: LivestockRepository;
  inventoryRepository: InventoryRepository;
  equipmentRepository: EquipmentRepository;

  // Services
  jwtService: JwtService;

  // Use Cases
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
  getTaskUseCase: GetTaskUseCase;
  listTasksUseCase: ListTasksUseCase;
  updateTaskStatusUseCase: UpdateTaskStatusUseCase;
  createLivestockGroupUseCase: CreateLivestockGroupUseCase;
  addLivestockAnimalUseCase: AddLivestockAnimalUseCase;
  listAnimalsByFarmUseCase: ListAnimalsByFarmUseCase;
  createHealthRecordUseCase: CreateHealthRecordUseCase;
  getHealthRecordsUseCase: GetHealthRecordsUseCase;
  updateAnimalHealthStatusUseCase: UpdateAnimalHealthStatusUseCase;
  scheduleVaccinationUseCase: ScheduleVaccinationUseCase;
  createVaccinationScheduleUseCase: CreateVaccinationScheduleUseCase;
  getVaccinationScheduleUseCase: GetVaccinationScheduleUseCase;
  updateVaccinationStatusUseCase: UpdateVaccinationStatusUseCase;
  getVaccinationRemindersUseCase: GetVaccinationRemindersUseCase;
  bulkScheduleVaccinationsUseCase: BulkScheduleVaccinationsUseCase;
  getLivestockHealthAnalyticsUseCase: GetLivestockHealthAnalyticsUseCase;
  recordTreatmentUseCase: RecordTreatmentUseCase;
  getAnimalHealthHistoryUseCase: GetAnimalHealthHistoryUseCase;
  updateAnimalWeightUseCase: UpdateAnimalWeightUseCase;
  createBreedingRecordUseCase: CreateBreedingRecordUseCase;
  updatePregnancyStatusUseCase: UpdatePregnancyStatusUseCase;
  getBreedingRecordsUseCase: GetBreedingRecordsUseCase;
  getBreedingAnalyticsUseCase: GetBreedingAnalyticsUseCase;
  deleteBreedingRecordUseCase: DeleteBreedingRecordUseCase;
  createInventoryItemUseCase: CreateInventoryItemUseCase;
  recordInventoryTransactionUseCase: RecordInventoryTransactionUseCase;
  getInventoryItemUseCase: GetInventoryItemUseCase;
  listInventoryItemsUseCase: ListInventoryItemsUseCase;
  updateInventoryItemUseCase: UpdateInventoryItemUseCase;
  deleteInventoryItemUseCase: DeleteInventoryItemUseCase;
  getInventoryAlertsUseCase: GetInventoryAlertsUseCase;
  getInventoryAnalyticsUseCase: GetInventoryAnalyticsUseCase;
  getInventoryTransactionsUseCase: GetInventoryTransactionsUseCase;
  createEquipmentUseCase: CreateEquipmentUseCase;
  scheduleMaintenanceUseCase: ScheduleMaintenanceUseCase;
  listEquipmentUseCase: ListEquipmentUseCase;
  getEquipmentUseCase: GetEquipmentUseCase;
  updateEquipmentUseCase: UpdateEquipmentUseCase;
  deleteEquipmentUseCase: DeleteEquipmentUseCase;
  getMaintenanceRecordsUseCase: GetMaintenanceRecordsUseCase;
  getEquipmentAnalyticsUseCase: GetEquipmentAnalyticsUseCase;
}

class DIContainer {
  private dependencies: Dependencies;

  constructor() {
    // Infrastructure layer - Repositories
    const userRepository = new PrismaUserRepository(prisma);
    const organizationRepository = new PrismaOrganizationRepository(prisma);
    const farmRepository = new PrismaFarmRepository(prisma);
    const fieldRepository = new PrismaFieldRepository(prisma);
    const cropRepository = new PrismaCropRepository(prisma);
    const taskRepository = new PrismaTaskRepository(prisma);
    const livestockRepository = new PrismaLivestockRepository(prisma);
    const inventoryRepository = new PrismaInventoryRepository(prisma);
    const equipmentRepository = new PrismaEquipmentRepository(prisma);

    // Infrastructure layer - Services
    const jwtService = new JwtService();

    // Application layer - Use Cases
    const registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      organizationRepository
    );
    const loginUserUseCase = new LoginUserUseCase(userRepository);
    const enableTwoFactorUseCase = new EnableTwoFactorUseCase(userRepository);
    const oauthLoginUseCase = new OAuthLoginUseCase(userRepository, jwtService);

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
    const getTaskUseCase = new GetTaskUseCase(taskRepository);
    const listTasksUseCase = new ListTasksUseCase(
      taskRepository,
      farmRepository
    );
    const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);

    const createLivestockGroupUseCase = new CreateLivestockGroupUseCase(
      livestockRepository
    );
    const addLivestockAnimalUseCase = new AddLivestockAnimalUseCase(
      livestockRepository
    );
    const listAnimalsByFarmUseCase = new ListAnimalsByFarmUseCase(
      livestockRepository
    );
    const createHealthRecordUseCase = new CreateHealthRecordUseCase(
      livestockRepository
    );
    const getHealthRecordsUseCase = new GetHealthRecordsUseCase(
      livestockRepository
    );
    const updateAnimalHealthStatusUseCase = new UpdateAnimalHealthStatusUseCase(
      livestockRepository
    );
    const scheduleVaccinationUseCase = new ScheduleVaccinationUseCase(
      livestockRepository
    );
    const createVaccinationScheduleUseCase =
      new CreateVaccinationScheduleUseCase(livestockRepository);
    const getVaccinationScheduleUseCase = new GetVaccinationScheduleUseCase(
      livestockRepository
    );
    const updateVaccinationStatusUseCase = new UpdateVaccinationStatusUseCase(
      livestockRepository
    );
    const getVaccinationRemindersUseCase = new GetVaccinationRemindersUseCase(
      livestockRepository
    );
    const bulkScheduleVaccinationsUseCase = new BulkScheduleVaccinationsUseCase(
      livestockRepository
    );
    const getLivestockHealthAnalyticsUseCase =
      new GetLivestockHealthAnalyticsUseCase(livestockRepository);
    const recordTreatmentUseCase = new RecordTreatmentUseCase(
      livestockRepository
    );
    const getAnimalHealthHistoryUseCase = new GetAnimalHealthHistoryUseCase(
      livestockRepository
    );
    const updateAnimalWeightUseCase = new UpdateAnimalWeightUseCase(
      livestockRepository
    );

    const createBreedingRecordUseCase = new CreateBreedingRecordUseCase(
      livestockRepository
    );
    const updatePregnancyStatusUseCase = new UpdatePregnancyStatusUseCase(
      livestockRepository
    );
    const getBreedingRecordsUseCase = new GetBreedingRecordsUseCase(
      livestockRepository
    );
    const getBreedingAnalyticsUseCase = new GetBreedingAnalyticsUseCase(
      livestockRepository
    );
    const deleteBreedingRecordUseCase = new DeleteBreedingRecordUseCase(
      livestockRepository
    );

    const createInventoryItemUseCase = new CreateInventoryItemUseCase(
      inventoryRepository
    );
    const recordInventoryTransactionUseCase =
      new RecordInventoryTransactionUseCase(inventoryRepository);
    const getInventoryItemUseCase = new GetInventoryItemUseCase(
      inventoryRepository
    );
    const listInventoryItemsUseCase = new ListInventoryItemsUseCase(
      inventoryRepository
    );
    const updateInventoryItemUseCase = new UpdateInventoryItemUseCase(
      inventoryRepository
    );
    const deleteInventoryItemUseCase = new DeleteInventoryItemUseCase(
      inventoryRepository
    );
    const getInventoryAlertsUseCase = new GetInventoryAlertsUseCase(
      inventoryRepository
    );
    const getInventoryAnalyticsUseCase = new GetInventoryAnalyticsUseCase(
      inventoryRepository
    );
    const getInventoryTransactionsUseCase = new GetInventoryTransactionsUseCase(
      inventoryRepository
    );

    const createEquipmentUseCase = new CreateEquipmentUseCase(
      equipmentRepository
    );
    const scheduleMaintenanceUseCase = new ScheduleMaintenanceUseCase(
      equipmentRepository
    );
    const listEquipmentUseCase = new ListEquipmentUseCase(equipmentRepository);
    const getEquipmentUseCase = new GetEquipmentUseCase(equipmentRepository);
    const updateEquipmentUseCase = new UpdateEquipmentUseCase(
      equipmentRepository
    );
    const deleteEquipmentUseCase = new DeleteEquipmentUseCase(
      equipmentRepository
    );
    const getMaintenanceRecordsUseCase = new GetMaintenanceRecordsUseCase(
      equipmentRepository
    );
    const getEquipmentAnalyticsUseCase = new GetEquipmentAnalyticsUseCase(
      equipmentRepository
    );

    this.dependencies = {
      // Repositories
      userRepository,
      farmRepository,
      organizationRepository,
      fieldRepository,
      cropRepository,
      taskRepository,
      livestockRepository,
      inventoryRepository,
      equipmentRepository,

      // Services
      jwtService,

      // Use Cases
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
      getTaskUseCase,
      listTasksUseCase,
      updateTaskStatusUseCase,
      createLivestockGroupUseCase,
      addLivestockAnimalUseCase,
      listAnimalsByFarmUseCase,
      createHealthRecordUseCase,
      getHealthRecordsUseCase,
      updateAnimalHealthStatusUseCase,
      scheduleVaccinationUseCase,
      createVaccinationScheduleUseCase,
      getVaccinationScheduleUseCase,
      updateVaccinationStatusUseCase,
      getVaccinationRemindersUseCase,
      bulkScheduleVaccinationsUseCase,
      getLivestockHealthAnalyticsUseCase,
      recordTreatmentUseCase,
      getAnimalHealthHistoryUseCase,
      updateAnimalWeightUseCase,
      createBreedingRecordUseCase,
      updatePregnancyStatusUseCase,
      getBreedingRecordsUseCase,
      getBreedingAnalyticsUseCase,
      deleteBreedingRecordUseCase,
      createInventoryItemUseCase,
      recordInventoryTransactionUseCase,
      getInventoryItemUseCase,
      listInventoryItemsUseCase,
      updateInventoryItemUseCase,
      deleteInventoryItemUseCase,
      getInventoryAlertsUseCase,
      getInventoryAnalyticsUseCase,
      getInventoryTransactionsUseCase,
      createEquipmentUseCase,
      scheduleMaintenanceUseCase,
      listEquipmentUseCase,
      getEquipmentUseCase,
      updateEquipmentUseCase,
      deleteEquipmentUseCase,
      getMaintenanceRecordsUseCase,
      getEquipmentAnalyticsUseCase
    };
  }

  get<T>(key: keyof Dependencies): T {
    return this.dependencies[key] as T;
  }

  // Livestock Use Cases
  getCreateLivestockGroupUseCase(): CreateLivestockGroupUseCase {
    return this.dependencies.createLivestockGroupUseCase;
  }

  getAddLivestockAnimalUseCase(): AddLivestockAnimalUseCase {
    return this.dependencies.addLivestockAnimalUseCase;
  }

  // Inventory Use Cases
  getCreateInventoryItemUseCase(): CreateInventoryItemUseCase {
    return this.dependencies.createInventoryItemUseCase;
  }

  getRecordInventoryTransactionUseCase(): RecordInventoryTransactionUseCase {
    return this.dependencies.recordInventoryTransactionUseCase;
  }

  getGetInventoryItemUseCase(): GetInventoryItemUseCase {
    return this.dependencies.getInventoryItemUseCase;
  }

  getListInventoryItemsUseCase(): ListInventoryItemsUseCase {
    return this.dependencies.listInventoryItemsUseCase;
  }

  getUpdateInventoryItemUseCase(): UpdateInventoryItemUseCase {
    return this.dependencies.updateInventoryItemUseCase;
  }

  getDeleteInventoryItemUseCase(): DeleteInventoryItemUseCase {
    return this.dependencies.deleteInventoryItemUseCase;
  }

  getGetInventoryAlertsUseCase(): GetInventoryAlertsUseCase {
    return this.dependencies.getInventoryAlertsUseCase;
  }

  getGetInventoryAnalyticsUseCase(): GetInventoryAnalyticsUseCase {
    return this.dependencies.getInventoryAnalyticsUseCase;
  }

  getGetInventoryTransactionsUseCase(): GetInventoryTransactionsUseCase {
    return this.dependencies.getInventoryTransactionsUseCase;
  }

  // Equipment Use Cases
  getCreateEquipmentUseCase(): CreateEquipmentUseCase {
    return this.dependencies.createEquipmentUseCase;
  }

  getScheduleMaintenanceUseCase(): ScheduleMaintenanceUseCase {
    return this.dependencies.scheduleMaintenanceUseCase;
  }

  getListEquipmentUseCase(): ListEquipmentUseCase {
    return this.dependencies.listEquipmentUseCase;
  }

  getGetEquipmentUseCase(): GetEquipmentUseCase {
    return this.dependencies.getEquipmentUseCase;
  }

  getUpdateEquipmentUseCase(): UpdateEquipmentUseCase {
    return this.dependencies.updateEquipmentUseCase;
  }

  getDeleteEquipmentUseCase(): DeleteEquipmentUseCase {
    return this.dependencies.deleteEquipmentUseCase;
  }

  getGetMaintenanceRecordsUseCase(): GetMaintenanceRecordsUseCase {
    return this.dependencies.getMaintenanceRecordsUseCase;
  }

  getGetEquipmentAnalyticsUseCase(): GetEquipmentAnalyticsUseCase {
    return this.dependencies.getEquipmentAnalyticsUseCase;
  }

  // Task Use Cases
  getCreateTaskUseCase(): CreateTaskUseCase {
    return this.dependencies.createTaskUseCase;
  }

  getGetTaskUseCase(): GetTaskUseCase {
    return this.dependencies.getTaskUseCase;
  }

  getListTasksUseCase(): ListTasksUseCase {
    return this.dependencies.listTasksUseCase;
  }

  getUpdateTaskStatusUseCase(): UpdateTaskStatusUseCase {
    return this.dependencies.updateTaskStatusUseCase;
  }

  // Field Use Cases
  getCreateFieldUseCase(): CreateFieldUseCase {
    return this.dependencies.createFieldUseCase;
  }

  getListFieldsUseCase(): ListFieldsUseCase {
    return this.dependencies.listFieldsUseCase;
  }
}

export const container = new DIContainer();
