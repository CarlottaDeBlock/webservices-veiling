import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { companies } from '../../src/drizzle/schema';

export const COMPANIES_SEED: (typeof companies.$inferInsert)[] = [
  {
    companyId: 1,
    name: 'LogiTrans BV',
    vatNumber: 'BE0123456789',
    address: 'Korenmarkt 1',
    city: 'Gent',
    country: 'BE',
    status: 'active',
    peppolId: '0123456789',
    createdAt: new Date('2025-09-01T07:00:00.000Z'),
  },
  {
    companyId: 2,
    name: 'WareHouse Pro NV',
    vatNumber: 'BE9876543210',
    address: 'Havenlaan 10',
    city: 'Brussel',
    country: 'BE',
    status: 'active',
    peppolId: '9876543210',
    createdAt: new Date('2025-09-01T07:30:00.000Z'),
  },
];

export async function seedCompanies(drizzle: DatabaseProvider) {
  await drizzle.insert(companies).values(COMPANIES_SEED);
}

export async function clearCompanies(drizzle: DatabaseProvider) {
  await drizzle.delete(companies);
}
