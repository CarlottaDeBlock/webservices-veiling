import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { seedLots, clearLots, LOTS_SEED } from './seeds/lots';
import { clearUsers, seedUsers } from './seeds/users';
import { loginUser, loginAdmin, loginStranger } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearBids } from './seeds/bids';
import { clearAuctions, seedAuctions } from './seeds/auctions';

describe('Lots', () => {
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userToken: string;
  let adminToken: string;
  let strangerToken: string;

  const url = '/api/lots';

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

    userToken = await loginUser(app);
    adminToken = await loginAdmin(app);
    strangerToken = await loginStranger(app);
  });

  afterAll(async () => {
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/lots', () => {
    it('should 200 and return all lots', async () => {
      const response = await request(app.getHttpServer()).get(url);
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(LOTS_SEED.length);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lotId: LOTS_SEED[0].lotId,
            title: LOTS_SEED[0].title,
            status: LOTS_SEED[0].status,
          }),
          expect.objectContaining({
            lotId: LOTS_SEED[1].lotId,
            title: LOTS_SEED[1].title,
            status: LOTS_SEED[1].status,
          }),
        ]),
      );
    });
  });

  describe('POST /api/lots', () => {
    const payload = {
      auctionId: 1,
      requestId: 3,
      requesterId: 1,
      title: 'New lot',
      description: 'Some description',
      startTime: '2025-09-12T08:00:00.000Z',
      endTime: '2025-09-13T08:00:00.000Z',
      category: 'Transport',
      reservedPrice: '100.00',
      startBid: '10.00',
      status: 'open',
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

  describe('GET /api/lots/:id', () => {
    it('should 200 and return the requested lot', async () => {
      const res = await request(app.getHttpServer()).get(`${url}/1`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        lotId: 1,
        title: LOTS_SEED[0].title,
        status: LOTS_SEED[0].status,
      });
      expect(res.body).toHaveProperty('bids');
    });

    it('should 404 when requesting not existing lot', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Lot not found');
    });

    it('should 400 with invalid lot id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('numeric string');
    });
  });

  describe('PUT /api/lots/:id access', () => {
    it('should 403 when non-owner tries to update lot', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/lots/1')
        .auth(strangerToken, { type: 'bearer' })
        .send({
          name: 'Hacked lot',
          description: 'x',
          startBid: 100,
          status: 'open',
          auctionId: 1,
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/lots/:id', () => {
    it('should 204 when admin deletes existing lot', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/lots/1')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
    });

    it('should 404 when deleting non-existent lot', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/lots/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });
});
