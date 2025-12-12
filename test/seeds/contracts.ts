import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { contracts } from '../../src/drizzle/schema';

export const CONTRACTS_SEED: (typeof contracts.$inferInsert)[] = [
  {
    contractId: 1,
    auctionId: 1,
    requesterId: 4,
    providerId: 3,
    status: 'active',
    startDate: new Date('2025-09-14T08:00:00.000Z'),
    endDate: new Date('2025-09-30T08:00:00.000Z'),
    agreedPrice: '650.00',
  },
  {
    contractId: 2,
    auctionId: 2,
    requesterId: 2,
    providerId: 2,
    status: 'completed',
    startDate: new Date('2025-09-17T08:00:00.000Z'),
    endDate: new Date('2025-09-25T08:00:00.000Z'),
    agreedPrice: '400.00',
  },
];

export async function seedContracts(drizzle: DatabaseProvider) {
  await drizzle.insert(contracts).values(CONTRACTS_SEED);
}

export async function clearContracts(drizzle: DatabaseProvider) {
  await drizzle.delete(contracts);
}
