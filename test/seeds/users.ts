import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { users } from '../../src/drizzle/schema';
import { Role } from '../../src/auth/roles';

export async function seedUsers(
  app: INestApplication,
  drizzle: DatabaseProvider,
) {
  const authService = app.get(AuthService);
  const passwordHash = await authService.hashPassword('12345678');

  await drizzle.insert(users).values([
    {
      userId: 1,
      username: 'testuser',
      email: 'test.user@example.com',
      passwordHash,
      roles: [Role.USER],
      isProvider: false,
      rating: null,
      companyId: null,
      role: Role.USER,
      language: 'nl',
      createdAt: new Date('2025-09-01T08:00:00.000Z'),
    },
    {
      userId: 2,
      username: 'adminuser',
      email: 'admin.user@example.com',
      passwordHash,
      roles: [Role.ADMIN, Role.USER],
      isProvider: false,
      rating: null,
      companyId: null,
      role: Role.ADMIN,
      language: 'nl',
      createdAt: new Date('2025-09-01T09:00:00.000Z'),
    },
    {
      userId: 3,
      username: 'provideruser',
      email: 'provider.user@example.com',
      passwordHash,
      roles: [Role.USER],
      isProvider: true,
      rating: null,
      companyId: null,
      role: Role.USER,
      language: 'nl',
      createdAt: new Date('2025-09-01T10:00:00.000Z'),
    },
    {
      userId: 4,
      username: 'requesteruser',
      email: 'requester.user@example.com',
      passwordHash,
      roles: [Role.USER],
      isProvider: false,
      rating: null,
      companyId: null,
      role: Role.USER,
      language: 'nl',
      createdAt: new Date('2025-09-01T11:00:00.000Z'),
    },
    {
      userId: 5,
      username: 'strangeruser',
      email: 'stranger.user@example.com',
      passwordHash,
      roles: [Role.USER],
      isProvider: false,
      rating: null,
      companyId: null,
      role: Role.USER,
      language: 'nl',
      createdAt: new Date('2025-09-01T12:00:00.000Z'),
    },
  ] as (typeof users.$inferInsert)[]);
}

export async function clearUsers(drizzle: DatabaseProvider) {
  await drizzle.delete(users);
}
