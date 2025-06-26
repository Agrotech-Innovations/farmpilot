import {User} from '../../../domain/entities';
import {UserRepository} from '../../../domain/repositories';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';

export interface LoginUserRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginUserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!request.twoFactorCode) {
        // Return temp token for 2FA verification
        const tempToken = this.generateTempToken(user);
        return {
          user,
          accessToken: '',
          refreshToken: '',
          requiresTwoFactor: true,
          tempToken
        };
      }

      // Verify 2FA code
      if (!this.verifyTwoFactorCode(user, request.twoFactorCode)) {
        throw new Error('Invalid two-factor authentication code');
      }
    }

    // Update last login
    const updatedUser = user.updateLastLogin();
    await this.userRepository.update(updatedUser);

    // Generate tokens
    const accessToken = this.generateAccessToken(updatedUser);
    const refreshToken = this.generateRefreshToken(updatedUser);

    return {
      user: updatedUser,
      accessToken,
      refreshToken
    };
  }

  private verifyTwoFactorCode(user: User, code: string): boolean {
    if (!user.twoFactorSecret) {
      return false;
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    // If TOTP fails, check backup codes
    if (!verified && user.twoFactorBackupCodes) {
      return user.twoFactorBackupCodes.includes(code);
    }

    return verified;
  }

  private generateTempToken(user: User): string {
    // In a real implementation, use JWT with short expiry
    return `temp_${user.id}_${Date.now()}`;
  }

  private generateAccessToken(user: User): string {
    // In a real implementation, use JWT
    return `access_${user.id}_${Date.now()}`;
  }

  private generateRefreshToken(user: User): string {
    // In a real implementation, use JWT
    return `refresh_${user.id}_${Date.now()}`;
  }
}
