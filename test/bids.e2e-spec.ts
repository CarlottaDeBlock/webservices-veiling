import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { seedLots, clearLots } from './seeds/lots';
import { clearUsers, seedUsers } from './seeds/users';
import {
  loginUser,
  loginProvider,
  loginAdmin,
  loginStranger,
} from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearAuctions, seedAuctions } from './seeds/auctions';
import { clearBids, seedBids } from './seeds/bids';

describe('Bids', () => {
  const url = '/api/bids';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userToken: string;
  let existingBidId: number;
  let providerToken: string;
  let adminToken: string;
  let strangerToken: string;

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
    await seedBids(drizzle);

    userToken = await loginUser(app);
    providerToken = await loginProvider(app);
    adminToken = await loginAdmin(app);
    strangerToken = await loginStranger(app);

    const res = await request(app.getHttpServer())
      .post(url)
      .auth(userToken, { type: 'bearer' })
      .send({
        auctionId: 1,
        lotId: 1,
        amount: 200.0,
      });

    existingBidId = res.body.bidId;
  });

  afterAll(async () => {
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/bids/:id', () => {
    it('should 200 and return the requested bid', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/${existingBidId}`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body.bidId).toBe(existingBidId);
      expect(res.body).toHaveProperty('amount');
      expect(res.body).toHaveProperty('bidder');
    });

    it('should 404 when bid does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999999`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Bid not found');
    });

    it('should 400 with invalid bid id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    it('should 200 and return bid for owner (seed bid 1)', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/${existingBidId}`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('bidId', existingBidId);
    });

    it('should 404 when user cannot access bid', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(providerToken, { type: 'bearer' }); // niet de bidder
      expect(res.statusCode).toBe(404);
    });
    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('POST /api/bids', () => {
    it('should 201 and create bid for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          lotId: 1,
          amount: 210.0,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        bidId: expect.any(Number),
        auctionId: 1,
        lotId: 1,
        amount: 210.0,
      });
    });

    it('should 400 when missing amount', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          lotId: 1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when amount is negative', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          lotId: 1,
          amount: -10.0,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('amount');
    });

    it('should 201 and create a new bid on open lot', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          lotId: 1,
          amount: 220.0,
          auctionId: 1,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        lotId: 1,
        amount: 220.0,
        auctionId: 1,
      });
    });

    it('should 400 when amount is below minimum or last bid', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          lotId: 1,
          amount: 1.0,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('amount');
    });

    it('should 404 when lot does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          lotId: 9999,
          amount: 100.0,
          auctionId: 1,
        });
      expect(res.statusCode).toBe(404);
    });

    it('should 400 when lot is closed (status closed in seeds)', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(userToken, { type: 'bearer' })
        .send({
          lotId: 2, // maak in seeds een gesloten lot
          amount: 100.0,
        });
      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).post(url).send({
        lotId: 1,
        amount: 100.0,
        auctionId: 1,
      }),
    );

    testAuthHeader(() =>
      request(app.getHttpServer())
        .post(url)
        .send({ auctionId: 1, lotId: 1, amount: 50.0 }),
    );
  });

  describe('GET /api/bids/auction/:auctionId', () => {
    it('should 200 and return bids for auction', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bids/auction/1')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('GET /api/bids/lot/:lotId', () => {
    it('should 200 and return bids for lot', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bids/lot/1')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('PUT /api/bids/:id', () => {
    it('should 403 when non-admin tries to update bid', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/bids/1')
        .auth(userToken, { type: 'bearer' })
        .send({ amount: 999, lotId: 1, auctionId: 1 });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/bids/:id', () => {
    it('should 204 when admin deletes bid', async () => {
      const create = await request(app.getHttpServer())
        .post('/api/bids')
        .auth(userToken, { type: 'bearer' })
        .send({ auctionId: 1, lotId: 1, amount: 1000 });

      const res = await request(app.getHttpServer())
        .delete(`/api/bids/${create.body.bidId}`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
    });

    it('should 404 when bid does not exist on delete', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/bids/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 404 when admin deletes non-existent bid', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/bids/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/bids', () => {
    it('should 200 and return all bids for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bids')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeGreaterThan(0);
    });

    it('should 200 and return empty list for user without bids', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/bids')
        .auth(strangerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toEqual([]);
    });
  });
});
