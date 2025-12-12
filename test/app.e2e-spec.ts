import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { clearUsers, seedUsers } from './seeds/users';

describe('App', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearUsers(drizzle);
    await seedUsers(app, drizzle);
  });

  afterAll(async () => {
    await clearUsers(drizzle);
    await app.close();
  });

  describe('POST /api/session (login)', () => {
    const url = '/api/session';

    it('should 200 and return a token for valid credentials', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        email: 'test.user@example.com',
        password: '12345678',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should 401 with wrong password', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        email: 'test.user@example.com',
        password: 'wrong-password',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should 401 with unknown email', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        email: 'unknown@example.com',
        password: '12345678',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should 400 when missing email', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        password: '12345678',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('email');
    });

    it('should 400 when missing password', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        email: 'test.user@example.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('password');
    });
  });

  describe('POST /api/users (register)', () => {
    const url = '/api/users';

    it('should 201 and return token for valid registration', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        username: 'newuser',
        email: 'new.user@example.com',
        password: '12345678',
        isProvider: false,
        language: 'nl',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should 400 when email is invalid', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        username: 'badmail',
        email: 'not-an-email',
        password: '12345678',
        isProvider: false,
        language: 'nl',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('email');
    });

    it('should 400 when password is too short', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        username: 'shortpwd',
        email: 'short.pwd@example.com',
        password: '1234567', // 7 chars
        isProvider: false,
        language: 'nl',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('password');
    });

    it('should 409 when username already exists', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        username: 'testuser',
        email: 'another@example.com',
        password: '12345678',
        isProvider: false,
        language: 'nl',
      });

      expect(res.statusCode).toBe(409);
    });

    it('should 409 when email already exists', async () => {
      const res = await request(app.getHttpServer()).post(url).send({
        username: 'anotheruser',
        email: 'test.user@example.com',
        password: '12345678',
        isProvider: false,
        language: 'nl',
      });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('GET /api', () => {
    const url = '/api';

    it('should return the app root message', async () => {
      const response = await request(app.getHttpServer()).get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Auction API' });
    });
  });
});
