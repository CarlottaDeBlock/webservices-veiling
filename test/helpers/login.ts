import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { LoginResponseDto } from '../../src/session/session.dto';

const extractToken = (result: LoginResponseDto | string): string => {
  if (typeof result === 'string') {
    return result;
  }
  if (result && typeof result === 'object' && 'token' in result) {
    return result.token;
  }
  throw new Error('No token received');
};

export const loginUser = async (app: INestApplication): Promise<string> => {
  const authService = app.get(AuthService);
  const result = await authService.login({
    email: 'test.user@example.com',
    password: '12345678',
  });

  if (!result) {
    throw new Error('No result received');
  }

  return extractToken(result);
};

export const loginAdmin = async (app: INestApplication): Promise<string> => {
  const authService = app.get(AuthService);
  const result = await authService.login({
    email: 'admin.user@example.com',
    password: '12345678',
  });

  if (!result) {
    throw new Error('No result received');
  }

  return extractToken(result);
};
