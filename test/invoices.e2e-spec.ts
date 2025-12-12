import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../src/drizzle/drizzle.provider';
import { clearUsers, seedUsers } from './seeds/users';
import { loginAdmin, loginProvider, loginStranger } from './helpers/login';
import testAuthHeader from './helpers/testAuthHeader';
import { clearInvoices, seedInvoices } from './seeds/invoices';
import { clearContracts, seedContracts } from './seeds/contracts';
import { clearBids } from './seeds/bids';
import { clearLots, seedLots } from './seeds/lots';
import { clearAuctions, seedAuctions } from './seeds/auctions';

describe('Invoices', () => {
  const url = '/api/invoices';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let adminToken: string;
  let strangerToken: string;
  let providerToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

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

    adminToken = await loginAdmin(app);
    strangerToken = await loginStranger(app);
    providerToken = await loginProvider(app);
  });

  afterAll(async () => {
    await clearInvoices(drizzle);
    await clearContracts(drizzle);
    await clearBids(drizzle);
    await clearLots(drizzle);
    await clearAuctions(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/invoices/:id', () => {
    it('should 200 and return the requested invoice', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        invoiceId: 1,
        status: 'unpaid',
      });
    });

    it('should 404 when invoice does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 with invalid invoice id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });
  describe('GET /api/invoices', () => {
    it('should 200 and return invoices for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/invoices')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('should 200 and return only own invoices for provider', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/invoices')
        .auth(providerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/invoices/:id access', () => {
    it('should 404 when invoice does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/invoices/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 404 when non-participant tries to access invoice', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/invoices/1')
        .auth(strangerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/invoices/:id', () => {
    it('should 200 and update invoice as admin', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/invoices/1')
        .auth(adminToken, { type: 'bearer' })
        .send({
          contractId: 1,
          amount: 1300.0,
          issueDate: '2025-10-01T00:00:00.000Z',
          dueDate: '2025-10-31T00:00:00.000Z',
          status: 'paid',
        });

      console.log(res.body.details?.body);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('paid');
    });

    it('should 404 when updating non-existent invoice', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/invoices/99999')
        .auth(adminToken, { type: 'bearer' })
        .send({
          contractId: 1,
          amount: 1300.0,
          issueDate: '2025-10-01T00:00:00.000Z',
          dueDate: '2025-10-31T00:00:00.000Z',
          status: 'paid',
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/invoices/:id', () => {
    it('should 204 when admin deletes existing invoice', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/invoices/1')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(204);
    });

    it('should 404 when deleting non-existent invoice', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/invoices/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });
});
