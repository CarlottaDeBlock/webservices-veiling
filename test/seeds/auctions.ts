import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { auctions } from '../../src/drizzle/schema';

export const AUCTIONS_SEED: (typeof auctions.$inferInsert)[] = [
  {
    auctionId: 1,
    title: 'Auction Transport',
    category: 'Transport',
    requesterId: 1,
    startTime: new Date('2025-11-01T08:00:00.000Z'),
    endTime: new Date('2025-11-05T17:00:00.000Z'),
    status: 'closed',
    createdAt: new Date('2025-11-01T08:00:00.000Z'),
  },
  {
    auctionId: 2,
    title: 'Auction restaurant',
    category: 'Horeca',
    requesterId: 1,
    startTime: new Date('2025-11-10T09:00:00.000Z'),
    endTime: new Date('2025-11-12T17:00:00.000Z'),
    status: 'closed',
    createdAt: new Date('2025-11-10T09:00:00.000Z'),
  },
];

export async function seedAuctions(drizzle: DatabaseProvider) {
  await drizzle.insert(auctions).values(AUCTIONS_SEED);
}

export async function clearAuctions(drizzle: DatabaseProvider) {
  await drizzle.delete(auctions);
}
