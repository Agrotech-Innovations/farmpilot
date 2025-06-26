import jwt from 'jsonwebtoken';
import {User} from '@/core/domain/entities';

export interface JwtPayload {
  userId: string;
  email: string;
  organizationIds: string[];
  type: 'access' | 'refresh' | 'temp';
}

export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET || 'your-access-secret';
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  generateAccessToken(user: User, organizationIds: string[]): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      organizationIds,
      type: 'access'
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'farm-pilot',
      audience: 'farm-pilot-app'
    });
  }

  generateRefreshToken(user: User, organizationIds: string[]): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      organizationIds,
      type: 'refresh'
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'farm-pilot',
      audience: 'farm-pilot-app'
    });
  }

  generateTempToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      organizationIds: [],
      type: 'temp'
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '10m', // Short expiry for 2FA verification
      issuer: 'farm-pilot',
      audience: 'farm-pilot-app'
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'farm-pilot',
        audience: 'farm-pilot-app'
      }) as JwtPayload;

      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'farm-pilot',
        audience: 'farm-pilot-app'
      }) as JwtPayload;

      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  verifyTempToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'farm-pilot',
        audience: 'farm-pilot-app'
      }) as JwtPayload;

      if (payload.type !== 'temp') {
        throw new Error('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired temp token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}
