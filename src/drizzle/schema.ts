import { sql } from 'drizzle-orm';
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
  requestId: int('request_id', { unsigned: true }).notNull(),
  requesterId: int('requester_id', { unsigned: true }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startTime: datetime('start_time', { fsp: 3 }).notNull(),
  endTime: datetime('end_time', { fsp: 3 }).notNull(),
  winnerId: int('winner_id', { unsigned: true }),
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
  isReversed: tinyint('is_reversed', { unsigned: true }).notNull().default(0),
  canBidHigher: tinyint('can_bid_higher', { unsigned: true })
    .notNull()
    .default(1),
});

export const bids = mysqlTable('bid', {
  bidId: int('bid_id', { unsigned: true }).primaryKey().autoincrement(),
  auctionId: int('auction_id', { unsigned: true }).notNull(),
  bidderId: int('bidder_id', { unsigned: true }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  bidTime: datetime('bid_time', { fsp: 3 }).notNull(),
});

export const users = mysqlTable(
  'user',
  {
    userId: int('user_id', { unsigned: true }).primaryKey().autoincrement(),
    username: varchar('username', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isProvider: tinyint('is_provider', { unsigned: true }).notNull().default(0),
    rating: tinyint('rating', { unsigned: true }),
    companyId: int('company_id', { unsigned: true }),
    role: varchar('role', { length: 100 }).notNull(),
    language: varchar('language', { length: 10 }).notNull(),
    createdAt: datetime('created_at', { fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [uniqueIndex('userId_user_username_unique').on(table.username)],
);

export const invoices = mysqlTable('invoice', {
  invoiceId: int('invoice_id', { unsigned: true }).primaryKey().autoincrement(),
  contractId: int('contract_id', { unsigned: true }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  issueDate: datetime('issue_date', { fsp: 3 }).notNull(),
  dueDate: datetime('due_date', { fsp: 3 }).notNull(),
  status: mysqlEnum('status', ['unpaid', 'paid', 'overdue']).notNull(),
});

export const contracts = mysqlTable('contract', {
  contractId: int('contract_id', { unsigned: true })
    .primaryKey()
    .autoincrement(),
  auctionId: int('auction_id', { unsigned: true }).notNull(),
  providerId: int('provider_id', { unsigned: true }).notNull(),
  requesterId: int('requester_id', { unsigned: true }).notNull(),
  agreedPrice: decimal('agreed_price', { precision: 10, scale: 2 }).notNull(),
  startDate: datetime('start_date', { fsp: 3 }).notNull(),
  endDate: datetime('end_date', { fsp: 3 }).notNull(),
  status: mysqlEnum('status', ['active', 'completed', 'cancelled']).notNull(),
});

export const reviews = mysqlTable('review', {
  reviewId: int('review_id', { unsigned: true }).primaryKey().autoincrement(),
  contractId: int('contract_id', { unsigned: true }).notNull(),
  reviewerId: int('reviewer_id', { unsigned: true }).notNull(),
  reviewedUserId: int('reviewed_user_id', { unsigned: true }).notNull(),
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
