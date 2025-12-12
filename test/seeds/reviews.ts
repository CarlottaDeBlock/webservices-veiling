import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { reviews } from '../../src/drizzle/schema';

export const REVIEWS_SEED: (typeof reviews.$inferInsert)[] = [
  {
    reviewId: 1,
    contractId: 1,
    reviewerId: 1,
    reviewedUserId: 2,
    rating: 5,
    comment: 'Great service, on time delivery.',
    createdAt: new Date('2025-10-01T08:00:00.000Z'),
  },
  {
    reviewId: 2,
    contractId: 1,
    reviewerId: 2,
    reviewedUserId: 1,
    rating: 4,
    comment: 'Clear communication, minor delay.',
    createdAt: new Date('2025-10-02T08:00:00.000Z'),
  },
];

export async function seedReviews(drizzle: DatabaseProvider) {
  await drizzle.insert(reviews).values(REVIEWS_SEED);
}

export async function clearReviews(drizzle: DatabaseProvider) {
  await drizzle.delete(reviews);
}
