import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { seedLots, clearLots, LOTS_SEED } from './seeds/lots';
import { clearUsers, seedUsers } from './seeds/users';
import { loginUser, loginAdmin } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';

describe('Lots', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userToken: string;
  let adminToken: string;

  const url = '/api/lots';

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await seedLots(drizzle);
    await seedUsers(app, drizzle);

    userToken = await loginUser(app);
    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearLots(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/lots', () => {
    it('should 200 and return all lots', async () => {
      const response = await request(app.getHttpServer())
        .get(url)
        .auth(userToken, { type: 'bearer' })
        .expect(200)
        .expect({ items: LOTS_SEED });

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toEqual(expect.arrayContaining(LOTS_SEED));

      testAuthHeader(() => request(app.getHttpServer()).get(url));
    });
  });

  describe('POST /api/lots', () => {
    const payload = {
      reqquestId: 3,
      requesterId: 1,
      title: 'New lot',
      description: 'Some description',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600_000).toISOString(),
      winnerId: null,
      category: 'Transport',
      reservedPrice: '100.00',
      buyPrice: null,
      startBid: '10.00',
      status: 'open',
      extraInformation: null,
      isReversed: true,
      canBidHigher: false,
    };

    it('should 201 and create lot for provider/admin', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .send(payload)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        title: payload.title,
        status: payload.status,
      });
    });

    testAuthHeader(() => request(app.getHttpServer()).post(url).send(payload));
  });
});
