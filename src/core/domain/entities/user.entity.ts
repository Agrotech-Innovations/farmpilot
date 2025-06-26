import {BaseEntity} from './base.entity';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseEntity {
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly phone?: string;
  public readonly isEmailVerified: boolean;
  public readonly emailVerifiedAt?: Date;
  public readonly lastLoginAt?: Date;
  public readonly twoFactorEnabled: boolean;
  public readonly twoFactorSecret?: string;
  public readonly twoFactorBackupCodes?: string[];

  constructor(props: UserProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.email, 'Email');
    this.validateRequired(props.passwordHash, 'Password hash');
    this.validateRequired(props.firstName, 'First name');
    this.validateRequired(props.lastName, 'Last name');

    // Validate email format
    if (!this.validateEmail(props.email)) {
      throw new Error('Invalid email format');
    }

    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.isEmailVerified = props.isEmailVerified ?? false;
    this.emailVerifiedAt = props.emailVerifiedAt;
    this.lastLoginAt = props.lastLoginAt;
    this.twoFactorEnabled = props.twoFactorEnabled ?? false;
    this.twoFactorSecret = props.twoFactorSecret;
    this.twoFactorBackupCodes = props.twoFactorBackupCodes;
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  public verifyEmail(): User {
    return new User({
      ...this.toProps(),
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateLastLogin(): User {
    return new User({
      ...this.toProps(),
      lastLoginAt: new Date(),
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public enableTwoFactor(secret: string, backupCodes: string[]): User {
    this.validateRequired(secret, 'Two-factor secret');
    if (!backupCodes || backupCodes.length === 0) {
      throw new Error(
        'Backup codes are required for two-factor authentication'
      );
    }

    return new User({
      ...this.toProps(),
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public disableTwoFactor(): User {
    return new User({
      ...this.toProps(),
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateProfile(
    firstName: string,
    lastName: string,
    phone?: string
  ): User {
    this.validateRequired(firstName, 'First name');
    this.validateRequired(lastName, 'Last name');

    return new User({
      ...this.toProps(),
      firstName,
      lastName,
      phone,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updatePassword(newPasswordHash: string): User {
    this.validateRequired(newPasswordHash, 'Password hash');

    return new User({
      ...this.toProps(),
      passwordHash: newPasswordHash,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  private toProps(): UserProps {
    return {
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      isEmailVerified: this.isEmailVerified,
      emailVerifiedAt: this.emailVerifiedAt,
      lastLoginAt: this.lastLoginAt,
      twoFactorEnabled: this.twoFactorEnabled,
      twoFactorSecret: this.twoFactorSecret,
      twoFactorBackupCodes: this.twoFactorBackupCodes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
