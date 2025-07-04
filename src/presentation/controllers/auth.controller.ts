import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  EnableTwoFactorUseCase
} from '@/core/application/use-cases/auth';
import {z} from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  organizationName: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  twoFactorCode: z.string().optional()
});

const enableTwoFactorSchema = z.object({
  userId: z.string(),
  appName: z.string().optional()
});

const confirmTwoFactorSchema = z.object({
  userId: z.string(),
  secret: z.string(),
  verificationCode: z.string()
});

// Server functions
export const registerUser = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return registerSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const registerUseCase = container.get<RegisterUserUseCase>(
        'registerUserUseCase'
      );

      const result = await registerUseCase.execute(data);

      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            isEmailVerified: result.user.isEmailVerified
          },
          organization: {
            id: result.organization.id,
            name: result.organization.name,
            slug: result.organization.slug
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  });

export const loginUser = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return loginSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const loginUseCase = container.get<LoginUserUseCase>('loginUserUseCase');

      const result = await loginUseCase.execute(data);

      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            isEmailVerified: result.user.isEmailVerified,
            twoFactorEnabled: result.user.twoFactorEnabled
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          requiresTwoFactor: result.requiresTwoFactor,
          tempToken: result.tempToken
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  });

export const enableTwoFactor = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return enableTwoFactorSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const enableTwoFactorUseCase = container.get<EnableTwoFactorUseCase>(
        'enableTwoFactorUseCase'
      );

      const result = await enableTwoFactorUseCase.execute(data);

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to enable two-factor authentication'
      };
    }
  });

export const confirmTwoFactor = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return confirmTwoFactorSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const enableTwoFactorUseCase = container.get<EnableTwoFactorUseCase>(
        'enableTwoFactorUseCase'
      );

      const result = await enableTwoFactorUseCase.confirm(
        data.userId,
        data.secret,
        data.verificationCode
      );

      return {
        success: true,
        data: {
          user: {
            id: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            twoFactorEnabled: result.twoFactorEnabled
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to confirm two-factor authentication'
      };
    }
  });
