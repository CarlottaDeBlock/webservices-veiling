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
import {
  clearCompanies,
  seedCompanies,
  COMPANIES_SEED,
} from './seeds/companies';

describe('Companies', () => {
  const url = '/api/companies';
  let app: INestApplication;
  let drizzle: DatabaseProvider;
  let adminToken: string;
  let providerToken: string;
  let strangerToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    drizzle = app.get(DrizzleAsyncProvider);

    await clearCompanies(drizzle);
    await clearUsers(drizzle);

    await seedUsers(app, drizzle);
    await seedCompanies(drizzle);

    adminToken = await loginAdmin(app);
    providerToken = await loginProvider(app);
    strangerToken = await loginStranger(app);
  });

  afterAll(async () => {
    await clearCompanies(drizzle);
    await clearUsers(drizzle);
    await app.close();
  });

  describe('GET /api/companies/:id', () => {
    it('should 200 and return the requested company', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(adminToken, { type: 'bearer' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        companyId: 1,
        name: COMPANIES_SEED[0].name,
      });
    });

    it('should 404 when company does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    it('should 400 with invalid company id', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/invalid`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(400);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('GET /api/companies', () => {
    it('should 200 and return all companies for admin', async () => {
      const res = await request(app.getHttpServer())
        .get(url)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            companyId: 1,
          }),
        ]),
      );
    });

    it('should 200 and return only the current user company for non-admin', async () => {
      const res = await request(app.getHttpServer())
        .get(url)
        .auth(providerToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeLessThanOrEqual(1);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(url));
  });

  describe('GET /api/companies/:id', () => {
    it('should 200 and return company for admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/1`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('companyId', 1);
    });

    it('should 404 when company does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}/9999`)
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(`${url}/1`));
  });

  describe('POST /api/companies', () => {
    it('should 201 and create company as admin', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(adminToken, { type: 'bearer' })
        .send({
          name: 'New Company',
          vatNumber: 'BE0123456789',
          address: 'Some street 1',
          city: 'Gent',
          country: 'BE',
          peppolId: '0210:1234567890',
          status: 'active',
          invoiceEmail: 'facturen@newcompany.be',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        name: 'New Company',
        vatNumber: 'BE0123456789',
        status: 'active',
      });
    });

    it('should 400 when VAT number is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(adminToken, { type: 'bearer' })
        .send({
          name: 'Bad VAT',
          vatNumber: 'BADVAT',
          address: 'x',
          city: 'x',
          country: 'x',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.details.body).toHaveProperty('vatNumber');
    });

    it('should 201 and create company as non-admin user', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .auth(providerToken, { type: 'bearer' })
        .send({
          name: 'Provider Company',
          vatNumber: 'BE0123456789',
          address: 'x',
          city: 'x',
          country: 'BE',
          status: 'active',
          peppolId: '0210:1234567890',
          invoiceEmail: 'faturen@provider.be',
        });

      expect(res.statusCode).toBe(201);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).post(url).send({
        name: 'NoAuth',
        vatNumber: 'BE0123456789',
        address: 'x',
        city: 'x',
        country: 'x',
      }),
    );
  });

  describe('GET /api/companies for user without company', () => {
    it('should 200 and return empty items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/companies')
        .auth(strangerToken, { type: 'bearer' }); // user zonder companyId

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toEqual([]);
    });
  });

  describe('PUT /api/companies/:id access control', () => {
    it('should 403 when non-related user tries to update company', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/companies/1')
        .auth(strangerToken, { type: 'bearer' })
        .send({
          name: 'Hack',
          vatNumber: 'BE0123456789',
          address: 'x',
          city: 'x',
          country: 'BE',
          status: 'active',
          peppolId: '0210:1234567890',
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/companies/:id', () => {
    it('should 404 when deleting non-existent company', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/companies/99999')
        .auth(adminToken, { type: 'bearer' });

      expect(res.statusCode).toBe(404);
    });
  });
});
