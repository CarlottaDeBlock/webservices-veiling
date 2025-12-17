import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { clearUsers, seedUsers } from './seeds/users';
import {
  loginAdmin,
  loginStranger,
  loginRequester,
  loginUser,
} from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearReviews, seedReviews } from './seeds/reviews';
import { clearContracts, seedContracts } from './seeds/contracts';
import { clearInvoices, seedInvoices } from './seeds/invoices';
import { clearBids } from './seeds/bids';
import { clearLots, seedLots } from './seeds/lots';
import { clearAuctions, seedAuctions } from './seeds/auctions';

describe('Reviews', () => {
  const url = '/api/reviews';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let userToken: string;
  let strangerToken: string;
  let adminToken: string;
  let requesterToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearReviews(drizzle);
    await clearInvoices(drizzle);
    await clearContracts(drizzle);
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);

    await seedUsers(app, drizzle);
    await seedAuctions(drizzle);
    await seedLots(drizzle);
    await seedContracts(drizzle);
    await seedInvoices(drizzle);
    await seedReviews(drizzle);

    userToken = await loginUser(app);
    adminToken = await loginAdmin(app);
    strangerToken = await loginStranger(app);
    requesterToken = await loginRequester(app);
  });

  afterAll(async () => {
    await clearReviews(drizzle);
    await clearInvoices(drizzle);
    await clearContracts(drizzle);
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/reviews/:id', () => {
    it('should 200 and return the requested review', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        reviewId: 1,
        rating: 5,
      });
    });

    it('should 404 when review does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 with invalid review id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should 204 and return nothing', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${url}/1`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it('should 400 with invalid review id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${url}/invalid`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    it('should 404 when review does not exist', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${url}/999`)
        .auth(userToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 204', async () => {
      const create = await request(app.getHttpServer())
        .post('/api/reviews')
        .auth(requesterToken, { type: 'bearer' })
        .send({
          contractId: 2,
          reviewedUserId: 2,
          rating: 4,
          comment: 'Goed, klein minpuntje',
        });

      const id = create.body.reviewId;

      const res = await request(app.getHttpServer())
        .delete(`/api/reviews/${id}`)
        .auth(requesterToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
    });

    testAuthHeader(() => request(app.getHttpServer()).delete(`${url}/1`));
  });

  describe('POST /api/reviews access', () => {
    it('should 404 when non-participant tries to create review', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/reviews')
        .auth(strangerToken, { type: 'bearer' })
        .send({
          contractId: 1,
          reviewerId: 5,
          reviewedUserId: 3,
          rating: 4,
          comment: 'Nice',
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/reviews', () => {
    it('should 200 and return reviews for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/reviews')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('POST /api/reviews', () => {
    it('POST /api/reviews should 201 and create review', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/reviews')
        .auth(requesterToken, { type: 'bearer' })
        .send({
          contractId: 2,
          reviewedUserId: 2,
          rating: 5,
          comment: 'Top samenwerking',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('reviewId');
    });
  });
});
