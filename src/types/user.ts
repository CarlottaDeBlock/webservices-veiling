import { users } from '../drizzle/schema';

export type User = typeof users.$inferInsert;
