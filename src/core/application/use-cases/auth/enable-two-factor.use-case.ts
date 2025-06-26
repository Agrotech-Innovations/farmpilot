import {User} from '../../../domain/entities';
import {UserRepository} from '../../../domain/repositories';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import {randomUUID} from 'crypto';

export interface EnableTwoFactorRequest {
  userId: string;
  appName?: string;
}

export interface EnableTwoFactorResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export class EnableTwoFactorUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    request: EnableTwoFactorRequest
  ): Promise<EnableTwoFactorResponse> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: user.email,
      issuer: request.appName || 'Farm Pilot',
      length: 32
    });

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    };
  }

  async confirm(
    userId: string,
    secret: string,
    verificationCode: string
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: verificationCode,
      window: 2
    });

    if (!verified) {
      throw new Error('Invalid verification code');
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Enable 2FA
    const updatedUser = user.enableTwoFactor(secret, backupCodes);
    return await this.userRepository.update(updatedUser);
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase());
    }
    return codes;
  }
}
