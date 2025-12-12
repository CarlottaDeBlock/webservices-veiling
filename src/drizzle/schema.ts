import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { json } from 'drizzle-orm/mysql-core';
import {
  int,
  mysqlTable,
  varchar,
  text,
  datetime,
  decimal,
  uniqueIndex,
  tinyint,
  mysqlEnum,
  primaryKey,
  boolean,
} from 'drizzle-orm/mysql-core';

export const auctions = mysqlTable('auctions', {
  auctionId: int('auction_id', { unsigned: true }).primaryKey().autoincrement(),
  requestId: int('request_id', { unsigned: true }).notNull(),
  startTime: datetime('start_time', { fsp: 3 }).notNull(),
  endTime: datetime('end_time', { fsp: 3 }).notNull(),
  status: mysqlEnum('status', ['open', 'closed', 'cancelled']).notNull(),
  createdAt: datetime('created_at', { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const lots = mysqlTable('lot', {
  lotId: int('lot_id', { unsigned: true }).primaryKey().autoincrement(),
  auctionId: int('auction_id', { unsigned: true })
    .references(() => auctions.auctionId, { onDelete: 'cascade' })
    .notNull(),
  requestId: int('request_id', { unsigned: true }).notNull(),
  requesterId: int('requester_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'no action' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startTime: datetime('start_time', { fsp: 3 }).notNull(),
  endTime: datetime('end_time', { fsp: 3 }).notNull(),
  winnerId: int('winner_id', { unsigned: true }).references(
    () => users.userId,
    { onDelete: 'set null' },
  ),
  category: varchar('category', { length: 100 }).notNull(),
  reservedPrice: decimal('reserved_price', {
    precision: 10,
    scale: 2,
  }).notNull(),
  buyPrice: decimal('buy_price', { precision: 10, scale: 2 }),
  startBid: decimal('start_bid', { precision: 10, scale: 2 }).notNull(),
  createdAt: datetime('created_at', { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  status: mysqlEnum('status', ['open', 'closed', 'cancelled']).notNull(),
  extraInformation: text('extra_information'),
  isReversed: boolean('is_reversed').notNull().default(false),
  canBidHigher: boolean('can_bid_higher').notNull().default(true),
});

export const bids = mysqlTable('bid', {
  bidId: int('bid_id', { unsigned: true }).primaryKey().autoincrement(),
  lotId: int('lot_id').notNull(),
  auctionId: int('auction_id', { unsigned: true })
    .references(() => auctions.auctionId, { onDelete: 'cascade' })
    .notNull(),
  bidderId: int('bidder_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  bidTime: datetime('bid_time', { fsp: 3 }).notNull(),
});

export const users = mysqlTable(
  'user',
  {
    userId: int('user_id', { unsigned: true }).primaryKey().autoincrement(),
    username: varchar('username', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    roles: json('roles').notNull(),
    isProvider: boolean('is_provider').notNull().default(true),
    rating: tinyint('rating', { unsigned: true }),
    companyId: int('company_id', { unsigned: true }).references(
      () => companies.companyId,
    ),
    role: varchar('role', { length: 100 }).notNull(),
    language: varchar('language', { length: 10 }).notNull(),
    createdAt: datetime('created_at', { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('userId_user_username_unique').on(table.username),
    uniqueIndex('userId_user_email_unique').on(table.email),
  ],
);

export const invoices = mysqlTable('invoice', {
  invoiceId: int('invoice_id', { unsigned: true }).primaryKey().autoincrement(),
  contractId: int('contract_id', { unsigned: true })
    .references(() => contracts.contractId, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  issueDate: datetime('issue_date', { fsp: 3 }).notNull(),
  dueDate: datetime('due_date', { fsp: 3 }).notNull(),
  status: mysqlEnum('status', ['unpaid', 'paid', 'overdue']).notNull(),
});

export const contracts = mysqlTable('contract', {
  contractId: int('contract_id', { unsigned: true })
    .primaryKey()
    .autoincrement(),
  auctionId: int('auction_id', { unsigned: true })
    .references(() => auctions.auctionId, { onDelete: 'cascade' })
    .notNull(),
  providerId: int('provider_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'no action' })
    .notNull(),
  requesterId: int('requester_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'no action' })
    .notNull(),
  agreedPrice: decimal('agreed_price', { precision: 10, scale: 2 }).notNull(),
  startDate: datetime('start_date', { fsp: 3 }).notNull(),
  endDate: datetime('end_date', { fsp: 3 }).notNull(),
  status: mysqlEnum('status', [
    'pending',
    'active',
    'completed',
    'cancelled',
  ]).notNull(),
});

export const reviews = mysqlTable('review', {
  reviewId: int('review_id', { unsigned: true }).primaryKey().autoincrement(),
  contractId: int('contract_id', { unsigned: true })
    .references(() => contracts.contractId, { onDelete: 'cascade' })
    .notNull(),
  reviewerId: int('reviewer_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  reviewedUserId: int('reviewed_user_id', { unsigned: true })
    .references(() => users.userId, { onDelete: 'no action' })
    .notNull(),
  rating: tinyint('rating', { unsigned: true }).notNull(),
  comment: text('comment'),
  createdAt: datetime('created_at', { fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const companies = mysqlTable(
  'company',
  {
    companyId: int('company_id', { unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    vatNumber: varchar('vat_number', { length: 32 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    country: varchar('country', { length: 2 }).notNull(),
    status: mysqlEnum('status', ['active', 'inactive']).notNull(),
    peppolId: varchar('peppol_id', { length: 64 }).notNull(),
    createdAt: datetime('created_at', { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    invoiceEmail: varchar('invoice_email', { length: 255 }),
  },
  (table) => [uniqueIndex('companyId_company_name_unique').on(table.name)],
);

export const userFavoriteLots = mysqlTable(
  'user_favorite_lots',
  {
    userId: int('user_id', { unsigned: true })
      .references(() => users.userId, { onDelete: 'cascade' })
      .notNull(),
    lotId: int('lot_id', { unsigned: true })
      .references(() => lots.lotId, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lotId] })],
);

export const bidsRelations = relations(bids, ({ one }) => ({
  bidder: one(users, {
    fields: [bids.bidderId],
    references: [users.userId],
    relationName: 'userBids',
  }),
  lot: one(lots, {
    relationName: 'lotBids',
    fields: [bids.lotId],
    references: [lots.lotId],
  }),
  auction: one(auctions, {
    fields: [bids.auctionId],
    references: [auctions.auctionId],
  }),
}));

export const lotsRelations = relations(lots, ({ one, many }) => ({
  auction: one(auctions, {
    fields: [lots.auctionId],
    references: [auctions.auctionId],
  }),
  bids: many(bids, {
    relationName: 'lotBids',
  }),
  requester: one(users, {
    fields: [lots.requesterId],
    references: [users.userId],
    relationName: 'requester',
  }),
  winner: one(users, {
    fields: [lots.winnerId],
    references: [users.userId],
    relationName: 'winner',
  }),
  favoredBy: many(userFavoriteLots),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.companyId],
  }),
  lotsRequested: many(lots, { relationName: 'requester' }),
  lotsWon: many(lots, { relationName: 'winner' }),
  bids: many(bids, { relationName: 'userBids' }),
  contractsAsProvider: many(contracts, { relationName: 'contractsAsProvider' }),
  contractsAsRequester: many(contracts, {
    relationName: 'contractsAsRequester',
  }),
  reviewsWritten: many(reviews, { relationName: 'reviewsWritten' }),
  reviewsReceived: many(reviews, { relationName: 'reviewsReceived' }),
  favoriteLots: many(userFavoriteLots),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  auction: one(auctions, {
    fields: [contracts.auctionId],
    references: [auctions.auctionId],
  }),
  provider: one(users, {
    fields: [contracts.providerId],
    references: [users.userId],
    relationName: 'contractsAsProvider',
  }),
  requester: one(users, {
    fields: [contracts.requesterId],
    references: [users.userId],
    relationName: 'contractsAsRequester',
  }),
  invoice: one(invoices, {
    fields: [contracts.contractId],
    references: [invoices.contractId],
  }),
  reviews: many(reviews, { relationName: 'contractReviews' }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  contract: one(contracts, {
    fields: [reviews.contractId],
    references: [contracts.contractId],
    relationName: 'contractReviews',
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.userId],
    relationName: 'reviewsWritten',
  }),
  reviewedUser: one(users, {
    fields: [reviews.reviewedUserId],
    references: [users.userId],
    relationName: 'reviewsReceived',
  }),
}));

export const userFavoriteLotsRelations = relations(
  userFavoriteLots,
  ({ one }) => ({
    lot: one(lots, {
      fields: [userFavoriteLots.lotId],
      references: [lots.lotId],
    }),
  }),
);

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
}));

export const auctionsRelations = relations(auctions, ({ many, one }) => ({
  lots: many(lots),
  bids: many(bids),
  contract: one(contracts, {
    fields: [auctions.auctionId],
    references: [contracts.auctionId],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  contract: one(contracts, {
    fields: [invoices.contractId],
    references: [contracts.contractId],
  }),
}));
