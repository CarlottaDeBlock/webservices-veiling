import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { seedLots, clearLots } from './seeds/lots';
import { clearUsers, seedUsers } from './seeds/users';
import { clearAuctions, seedAuctions } from './seeds/auctions';
import { clearBids } from './seeds/bids';
import { loginAdmin } from './helpers/login';

describe('Auctions', () => {
  const url = '/api/auctions';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);

    await seedUsers(app, drizzle);
    await seedAuctions(drizzle);
    await seedLots(drizzle);

    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/auctions/:id', () => {
    it('should 200 and return the requested auction', async () => {
      const res = await request(app.getHttpServer()).get(`${url}/1`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        auctionId: 1,
        status: 'open',
      });
      expect(res.body).toHaveProperty('lots');
      expect(res.body).toHaveProperty('bids');
    });

    it('should 404 when requesting not existing auction', async () => {
      const res = await request(app.getHttpServer()).get(`${url}/999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Auction not found');
    });

    it('should 400 with invalid auction id', async () => {
      const res = await request(app.getHttpServer()).get(`${url}/invalid`);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/auctions with filters', () => {
    it('should 200 and filter open auctions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auctions?status=open')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
    });
  });
});
