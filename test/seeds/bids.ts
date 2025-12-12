import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { bids } from '../../src/drizzle/schema';

export const BIDS_SEED: (typeof bids.$inferInsert)[] = [
  {
    lotId: 1,
    auctionId: 1,
    bidderId: 1,
    amount: '150.00',
    bidTime: new Date('2025-09-12T09:30:00.000Z'),
  },
  {
    lotId: 2,
    auctionId: 1,
    bidderId: 1,
    amount: '175.00',
    bidTime: new Date('2025-09-12T10:00:00.000Z'),
  },
];

export async function seedBids(drizzle: DatabaseProvider) {
  await drizzle.insert(bids).values(BIDS_SEED);
}

export async function clearBids(drizzle: DatabaseProvider) {
  await drizzle.delete(bids);
}
