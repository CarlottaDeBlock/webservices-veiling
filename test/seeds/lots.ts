import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { lots } from '../../src/drizzle/schema';

export const LOTS_SEED: (typeof lots.$inferInsert)[] = [
  {
    lotId: 1,
    auctionId: 1,
    requestId: 1,
    requesterId: 1,
    title: 'Transport 50 beer kegs',
    description: 'From Ghent to Brussels',
    startTime: new Date('2025-09-12T08:00:00.000Z'),
    endTime: new Date('2025-09-13T08:00:00.000Z'),
    winnerId: null,
    category: 'Transport',
    reservedPrice: '500.00',
    buyPrice: '750.00',
    startBid: '50.00',
    status: 'open',
    extraInformation: null,
    isReversed: true,
    canBidHigher: true,
    createdAt: new Date('2025-09-12T08:55:15.039Z'),
  },
  {
    lotId: 2,
    auctionId: 1,
    requestId: 2,
    requesterId: 2,
    title: 'Warehouse handling',
    description: 'Load and unload pallets',
    startTime: new Date('2025-09-15T08:00:00.000Z'),
    endTime: new Date('2025-09-16T08:00:00.000Z'),
    winnerId: null,
    category: 'Warehousing',
    reservedPrice: '300.00',
    buyPrice: null,
    startBid: '50.00',
    status: 'open',
    extraInformation: null,
    isReversed: true,
    canBidHigher: false,
    createdAt: new Date('2025-09-15T08:55:15.039Z'),
  },
];

export async function seedLots(drizzle: DatabaseProvider) {
  await drizzle.insert(lots).values(LOTS_SEED);
}

export async function clearLots(drizzle: DatabaseProvider) {
  await drizzle.delete(lots);
}
