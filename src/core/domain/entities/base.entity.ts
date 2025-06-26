// Base entity with common properties
export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public equals(entity: BaseEntity): boolean {
    return this.id === entity.id;
  }

  // Common method to update the updatedAt timestamp
  protected withUpdatedTimestamp(): Date {
    return new Date();
  }

  // Common validation method
  protected validateRequired(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} is required`);
    }
  }

  // Common method to validate email format
  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Common method to validate positive numbers
  protected validatePositiveNumber(value: number, fieldName: string): void {
    if (value < 0) {
      throw new Error(`${fieldName} must be a positive number`);
    }
  }
}
