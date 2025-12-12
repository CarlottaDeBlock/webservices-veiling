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
  loginProvider,
  loginRequester,
  loginStranger,
} from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearAuctions, seedAuctions } from './seeds/auctions';
import { clearContracts, seedContracts } from './seeds/contracts';
import { clearInvoices, seedInvoices } from './seeds/invoices';

describe('Contracts', () => {
  const url = '/api/contracts';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let adminToken: string;
  let providerToken: string;
  let requesterToken: string;
  let strangerToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearInvoices(drizzle);
    await clearContracts(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await seedUsers(app, drizzle);
    await seedAuctions(drizzle);
    await seedContracts(drizzle);
    await seedInvoices(drizzle);
    adminToken = await loginAdmin(app);
    providerToken = await loginProvider(app);
    requesterToken = await loginRequester(app);
    strangerToken = await loginStranger(app);
  });

  afterAll(async () => {
    await clearInvoices(drizzle);
    await clearContracts(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/contracts/:id', () => {
    it('should 200 and return the requested contract', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        contractId: 1,
        status: 'active',
      });
      expect(res.body).toHaveProperty('invoice');
    });

    it('should 200 for requester of the contract', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(requesterToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('contractId', 1);
    });

    it('should 200 for provider of the contract', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(providerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
    });

    it('should 404 when contract does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/9999`)
        .auth(requesterToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 404 when contract does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 with invalid contract id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('PUT /api/contracts/:id', () => {
    it('should 200 and return the updated contract', async () => {
      const res = await request(app.getHttpServer())
        .put(`${url}/1`)
        .auth(providerToken, { type: 'bearer' })
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        contractId: 1,
        status: 'completed',
      });
    });

    it('should 400 with invalid contract id', async () => {
      const res = await request(app.getHttpServer())
        .put(`${url}/invalid`)
        .auth(adminToken, { type: 'bearer' })
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(400);
    });

    it('should 404 when contract does not exist', async () => {
      const res = await request(app.getHttpServer())
        .put(`${url}/999`)
        .auth(providerToken, { type: 'bearer' })
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 when status is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`${url}/1`)
        .auth(providerToken, { type: 'bearer' })
        .send({
          status: 'INVALID_STATUS',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('status');
    });

    it('should 404 when non-participant tries to update contract', async () => {
      const res = await request(app.getHttpServer())
        .put(`${url}/1`)
        .auth(strangerToken, { type: 'bearer' })
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(404);
    });

    testAuthHeader(() =>
      request(app.getHttpServer())
        .put(`${url}/1`)
        .send({ status: 'completed' }),
    );
  });

  describe('POST /api/contracts', () => {
    it('should 201 and create contract', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/contracts')
        .auth(adminToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          providerId: 3,
          requesterId: 4,
          agreedPrice: '123.45',
          startDate: '2025-10-01T00:00:00.000Z',
          endDate: '2025-10-10T00:00:00.000Z',
          status: 'pending',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('contractId');
    });
  });

  describe('DELETE /api/contracts/:id', () => {
    it('should 204 when deleting existing contract', async () => {
      const create = await request(app.getHttpServer())
        .post(url)
        .auth(adminToken, { type: 'bearer' })
        .send({
          auctionId: 1,
          providerId: 3,
          requesterId: 4,
          agreedPrice: '200.00',
          startDate: '2025-10-01T00:00:00.000Z',
          endDate: '2025-10-02T00:00:00.000Z',
          status: 'active',
        });

      const res = await request(app.getHttpServer())
        .delete(`/api/contracts/${create.body.contractId}`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
    });
    it('should 204 when participant deletes own contract', async () => {
      const create = await request(app.getHttpServer())
        .post(url)
        .auth(adminToken, { type: 'bearer' }) // aanmaken als admin
        .send({
          auctionId: 1,
          providerId: 3,
          requesterId: 4,
          agreedPrice: '300.00',
          startDate: '2025-10-03T00:00:00.000Z',
          endDate: '2025-10-04T00:00:00.000Z',
          status: 'active',
        });

      const res = await request(app.getHttpServer())
        .delete(`${url}/${create.body.contractId}`)
        .auth(providerToken, { type: 'bearer' }); // providerId = 3 in seeds

      expect(res.statusCode).toBe(204);
    });

    it('should 404 when non-participant tries to delete contract', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${url}/1`)
        .auth(strangerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });
});
