import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { seedUsers, clearUsers } from './seeds/users';
import { loginUser, loginAdmin } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';

describe('Users', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userToken: string;
  let adminToken: string;

  const baseUrl = '/api/users';

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearUsers(drizzle);
    await seedUsers(app, drizzle);

    userToken = await loginUser(app);
    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/users (admin only)', () => {
    it('should 200 and return all users for admin', async () => {
      const res = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: 1,
            username: 'testuser',
          }),
          expect.objectContaining({
            userId: 2,
            username: 'adminuser',
          }),
        ]),
      );
    });

    it('should 403 for non-admin', async () => {
      const res = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(403);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(baseUrl));
  });

  describe('GET /api/users/me', () => {
    it('should 200 and return the current user profile', async () => {
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/me`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        userId: 1,
        username: 'testuser',
        email: 'test.user@example.com',
      });
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('should respond with 401 when not authenticated', async () => {
      const res = await request(app.getHttpServer()).get(`${baseUrl}/me`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should 200 and return requested user for admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/1`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        userId: 1,
        username: 'testuser',
        email: 'test.user@example.com',
      });
    });

    it('should 404 when user does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 with invalid user id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/invalid`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${baseUrl}/1`));
  });

  describe('PUT /api/users/:id', () => {
    it('should 200 and update the current user (me)', async () => {
      const res = await request(app.getHttpServer())
        .put(`${baseUrl}/me`)
        .auth(userToken, { type: 'bearer' })
        .send({
          username: 'updateduser',
          email: 'updated.user@example.com',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        userId: 1,
        username: 'updateduser',
        email: 'updated.user@example.com',
      });
    });

    it('should 400 with invalid email', async () => {
      const res = await request(app.getHttpServer())
        .put(`${baseUrl}/me`)
        .auth(userToken, { type: 'bearer' })
        .send({
          username: 'stillok',
          email: 'not-an-email',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('email');
    });

    it('should 404 when user tries to update another user', async () => {
      const res = await request(app.getHttpServer())
        .put(`${baseUrl}/2`)
        .auth(userToken, { type: 'bearer' })
        .send({
          username: 'hacker',
          email: 'hacker@example.com',
        });

      expect(res.statusCode).toBe(404);
    });

    it('should 404 when admin updates non-existing user', async () => {
      const res = await request(app.getHttpServer())
        .put(`${baseUrl}/999`)
        .auth(adminToken, { type: 'bearer' })
        .send({
          username: 'ghost',
          email: 'ghost@example.com',
        });

      expect(res.statusCode).toBe(404);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).put(`${baseUrl}/1`).send({
        username: 'noauth',
        email: 'noauth@example.com',
      }),
    );
  });

  describe('DELETE /api/users/:id', () => {
    it('should 204 when user deletes self (me)', async () => {
      const registerRes = await request(app.getHttpServer())
        .post(baseUrl)
        .send({
          username: 'tobedeleted',
          email: 'to.be.deleted@example.com',
          password: '12345678',
          isProvider: false,
          language: 'nl',
        });

      expect(registerRes.statusCode).toBe(201);
      const token = registerRes.body.token as string;

      const deleteRes = await request(app.getHttpServer())
        .delete(`${baseUrl}/me`)
        .auth(token, { type: 'bearer' });

      expect(deleteRes.statusCode).toBe(204);
      expect(deleteRes.body).toEqual({});
    });

    it('should 404 when admin deletes non-existing user', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${baseUrl}/999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    testAuthHeader(() => request(app.getHttpServer()).delete(`${baseUrl}/1`));
  });
});
