import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { auctions } from '../../src/drizzle/schema';

export const AUCTIONS_SEED: (typeof auctions.$inferInsert)[] = [
  {
    auctionId: 1,
    requestId: 1,
    status: 'open',
    startTime: new Date('2025-09-12T09:00:00.000Z'),
    endTime: new Date('2025-09-13T09:00:00.000Z'),
    createdAt: new Date('2025-09-12T09:00:00.000Z'),
  },
  {
    auctionId: 2,
    requestId: 2,
    status: 'open',
    startTime: new Date('2025-09-15T09:00:00.000Z'),
    endTime: new Date('2025-09-16T09:00:00.000Z'),
    createdAt: new Date('2025-09-15T09:00:00.000Z'),
  },
];

export async function seedAuctions(drizzle: DatabaseProvider) {
  await drizzle.insert(auctions).values(AUCTIONS_SEED);
}

export async function clearAuctions(drizzle: DatabaseProvider) {
  await drizzle.delete(auctions);
}
