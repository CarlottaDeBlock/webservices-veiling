import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';
import * as argon2 from 'argon2';
import { Role } from '../auth/roles';
import config from '../config/configuration';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,
});

const db = drizzle(connection, {
  schema,
  mode: 'default',
});

const auth = config().auth;

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: auth.hashLength,
    timeCost: auth.timeCost,
    memoryCost: auth.memoryCost,
  });
}

function computeStatus(start: Date, end: Date): 'open' | 'closed' {
  const now = new Date();
  if (now >= start && now <= end) return 'open';
  return 'closed';
}

async function resetDatabase() {
  console.log('🗑️ Resetting database...');

  await db.delete(schema.reviews);
  await db.delete(schema.invoices);
  await db.delete(schema.contracts);
  await db.delete(schema.bids);
  await db.delete(schema.auctions);
  await db.delete(schema.lots);
  await db.delete(schema.users);
  await db.delete(schema.companies);

  console.log('✅ Database reset completed\n');
}

async function seedCompanies() {
  console.log('🏢 Seeding companies...');

  await db.insert(schema.companies).values([
    {
      companyId: 1,
      name: 'Acme Logistics',
      vatNumber: 'BE0123456789',
      address: 'Industriepark 1',
      city: 'Gent',
      country: 'BE',
      status: 'active',
      peppolId: 'acme-logistics-peppol',
      invoiceEmail: 'invoices@acme-logistics.test',
    },
    {
      companyId: 2,
      name: 'Global Supplies',
      vatNumber: 'BE0987654321',
      address: 'Havenstraat 10',
      city: 'Antwerpen',
      country: 'BE',
      status: 'active',
      peppolId: 'global-supplies-peppol',
      invoiceEmail: 'billing@global-supplies.test',
    },
  ]);

  console.log('✅ Companies seeded\n');
}

async function seedUsers() {
  console.log('👤 Seeding users...');

  await db.insert(schema.users).values([
    {
      userId: 1,
      username: 'requester_anna',
      email: 'anna.requester@test.dev',
      passwordHash: await hashPassword('12345678'),
      isProvider: false,
      rating: 5,
      companyId: 1,
      role: 'requester',
      language: 'nl',
      roles: [Role.USER, Role.REQUESTER],
    },
    {
      userId: 2,
      username: 'provider_bob',
      email: 'bob.provider@test.dev',
      passwordHash: await hashPassword('12345678'),
      isProvider: true,
      rating: 4,
      companyId: 2,
      role: 'provider',
      language: 'nl',
      roles: [Role.USER, Role.PROVIDER],
    },
    {
      userId: 3,
      username: 'admin',
      email: 'admin@test.dev',
      passwordHash: await hashPassword('12345678'),
      isProvider: true,
      rating: 5,
      companyId: 2,
      role: 'admin',
      language: 'en',
      roles: [Role.USER, Role.ADMIN],
    },
    {
      userId: 4,
      username: 'stranger',
      email: 'stranger@example.com',
      passwordHash: 'hashedpassword4',
      roles: Role.USER,
      isProvider: false,
      rating: 3,
      companyId: 1,
      role: 'user',
      language: 'en',
    },
  ]);

  console.log('✅ Users seeded\n');
}

async function seedAuctions() {
  console.log('🔨 Seeding auctions...');

  await db.insert(schema.auctions).values([
    // VERLEDEN (gesloten)
    {
      auctionId: 1,
      title: 'Auction Transport',
      category: 'Transport',
      requesterId: 1,
      startTime: new Date('2025-11-01T08:00:00.000Z'),
      endTime: new Date('2025-11-05T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-11-01T08:00:00.000Z'),
        new Date('2025-11-05T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 2,
      title: 'Auction restaurant',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2025-11-10T09:00:00.000Z'),
      endTime: new Date('2025-11-12T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-11-10T09:00:00.000Z'),
        new Date('2025-11-12T17:00:00.000Z'),
      ),
    },

    // NU OPEN (periode rond mid‑december 2025)
    {
      auctionId: 3,
      title: 'Auction autos',
      category: 'Rollend Materiaal',
      requesterId: 1,
      startTime: new Date('2025-12-15T08:00:00.000Z'),
      endTime: new Date('2025-12-20T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-15T08:00:00.000Z'),
        new Date('2025-12-20T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 4,
      title: 'Auction huis',
      category: 'Vastgoed',
      requesterId: 1,
      startTime: new Date('2025-12-16T09:00:00.000Z'),
      endTime: new Date('2025-12-22T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-16T09:00:00.000Z'),
        new Date('2025-12-22T17:00:00.000Z'),
      ),
    },

    // TOEKOMST (nog niet open)
    {
      auctionId: 5,
      title: 'Auction keuken',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2026-01-10T09:00:00.000Z'),
      endTime: new Date('2026-01-12T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-01-10T09:00:00.000Z'),
        new Date('2026-01-12T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 6,
      title: 'Auction Vrachtwagen',
      category: 'Rollend Materiaal',
      requesterId: 1,
      startTime: new Date('2026-02-01T08:00:00.000Z'),
      endTime: new Date('2026-02-05T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-02-01T08:00:00.000Z'),
        new Date('2026-02-05T17:00:00.000Z'),
      ),
    },

    // nog wat extra mix (een gesloten, een open, een toekomst)
    {
      auctionId: 7,
      title: 'Auction appartement',
      category: 'Vastgoed',
      requesterId: 1,
      startTime: new Date('2025-10-01T09:00:00.000Z'),
      endTime: new Date('2025-10-05T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-10-01T09:00:00.000Z'),
        new Date('2025-10-05T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 8,
      title: 'Auction zaal materiaal',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2025-12-10T09:00:00.000Z'),
      endTime: new Date('2025-12-25T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-10T09:00:00.000Z'),
        new Date('2025-12-25T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 9,
      title: 'Auction ritten met camions naar Antwerpen',
      category: 'Transport',
      requesterId: 1,
      startTime: new Date('2026-03-01T09:00:00.000Z'),
      endTime: new Date('2026-03-05T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-03-01T09:00:00.000Z'),
        new Date('2026-03-05T17:00:00.000Z'),
      ),
    },

    {
      auctionId: 10,
      title: 'Auction chef',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2025-12-14T09:00:00.000Z'),
      endTime: new Date('2025-12-18T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-14T09:00:00.000Z'),
        new Date('2025-12-18T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 11,
      title: 'Auction bestelwagens',
      category: 'Rollend Materiaal',
      requesterId: 1,
      startTime: new Date('2026-04-01T09:00:00.000Z'),
      endTime: new Date('2026-04-10T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-04-01T09:00:00.000Z'),
        new Date('2026-04-10T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 12,
      title: 'Auction kantoor',
      category: 'Vastgoed',
      requesterId: 1,
      startTime: new Date('2025-09-01T09:00:00.000Z'),
      endTime: new Date('2025-09-10T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-09-01T09:00:00.000Z'),
        new Date('2025-09-10T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 13,
      title: 'Auction keukengerei',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2026-05-01T09:00:00.000Z'),
      endTime: new Date('2026-05-03T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-05-01T09:00:00.000Z'),
        new Date('2026-05-03T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 14,
      title: 'Auction paard en kar',
      category: 'Rollend Materiaal',
      requesterId: 1,
      startTime: new Date('2025-12-01T09:00:00.000Z'),
      endTime: new Date('2025-12-03T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-01T09:00:00.000Z'),
        new Date('2025-12-03T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 15,
      title: 'Auction meubilair',
      category: 'Vastgoed',
      requesterId: 1,
      startTime: new Date('2026-06-01T09:00:00.000Z'),
      endTime: new Date('2026-06-10T17:00:00.000Z'),
      status: computeStatus(
        new Date('2026-06-01T09:00:00.000Z'),
        new Date('2026-06-10T17:00:00.000Z'),
      ),
    },
    {
      auctionId: 16,
      title: 'Auction tafels en stoelen',
      category: 'Horeca',
      requesterId: 1,
      startTime: new Date('2025-12-10T09:00:00.000Z'),
      endTime: new Date('2025-12-19T17:00:00.000Z'),
      status: computeStatus(
        new Date('2025-12-10T09:00:00.000Z'),
        new Date('2025-12-19T17:00:00.000Z'),
      ),
    },
  ]);

  console.log('✅ Auctions seeded\n');
}

async function seedLots() {
  console.log('📦 Seeding lots...');

  await db.insert(schema.lots).values([
    // Lot binnen auction 3 (open: 15–20 dec 2025)
    {
      auctionId: 3,
      requesterId: 1,
      title: 'Transport 10 pallets Gent → Antwerpen',
      description: 'Verzending van 10 pallets niet-bederfbare goederen.',
      startTime: new Date('2025-12-17T09:00:00.000Z'),
      endTime: new Date('2025-12-19T17:00:00.000Z'),
      winnerId: null,
      category: 'transport',
      reservedPrice: '800.00',
      buyPrice: '1200.00',
      startBid: '500.00',
      status: computeStatus(
        new Date('2025-12-17T09:00:00.000Z'),
        new Date('2025-12-19T17:00:00.000Z'),
      ),
      extraInformation: 'Laadplaats met dok, heftruck aanwezig.',
      isReversed: true,
      canBidHigher: true,
      createdAt: new Date('2025-12-10T08:55:15.039Z'),
    },

    // Lot binnen auction 4 (open: 16–22 dec 2025)
    {
      auctionId: 4,
      requesterId: 1,
      title: 'Opslagruimte 3 maanden',
      description: 'Opslag van 20 pallets droge voeding.',
      startTime: new Date('2025-12-17T08:00:00.000Z'),
      endTime: new Date('2025-12-20T16:00:00.000Z'),
      winnerId: null,
      category: 'storage',
      reservedPrice: '1500.00',
      buyPrice: null,
      startBid: '900.00',
      status: computeStatus(
        new Date('2025-12-17T08:00:00.000Z'),
        new Date('2025-12-20T16:00:00.000Z'),
      ),
      extraInformation: 'Magazijn met temperatuurcontrole niet nodig.',
      isReversed: true,
      canBidHigher: true,
      createdAt: new Date('2025-12-11T08:55:15.039Z'),
    },

    // Lot binnen auction 1 (verleden: 1–5 nov 2025)
    {
      auctionId: 1,
      requesterId: 1,
      title: 'Historische rit met vrachtwagen',
      description: 'Eenmalige rit, reeds afgelopen.',
      startTime: new Date('2025-11-02T09:00:00.000Z'),
      endTime: new Date('2025-11-02T15:00:00.000Z'),
      winnerId: null,
      category: 'transport',
      reservedPrice: '600.00',
      buyPrice: '900.00',
      startBid: '400.00',
      status: computeStatus(
        new Date('2025-11-02T09:00:00.000Z'),
        new Date('2025-11-02T15:00:00.000Z'),
      ),
      extraInformation: 'Traject reeds uitgevoerd.',
      isReversed: false,
      canBidHigher: true,
      createdAt: new Date('2025-10-20T08:55:15.039Z'),
    },

    // Lot binnen auction 5 (toekomst: 10–12 jan 2026)
    {
      auctionId: 5,
      requesterId: 1,
      title: 'Keukeninstallatie in nieuw restaurant',
      description: 'Volledige installatie van een horecakeuken.',
      startTime: new Date('2026-01-11T09:00:00.000Z'),
      endTime: new Date('2026-01-11T17:00:00.000Z'),
      winnerId: null,
      category: 'horeca',
      reservedPrice: '5000.00',
      buyPrice: null,
      startBid: '3000.00',
      status: computeStatus(
        new Date('2026-01-11T09:00:00.000Z'),
        new Date('2026-01-11T17:00:00.000Z'),
      ),
      extraInformation: 'Inclusief montage en afwerking.',
      isReversed: false,
      canBidHigher: true,
      createdAt: new Date('2025-12-15T08:55:15.039Z'),
    },
  ]);

  console.log('✅ Lots seeded\n');
}

async function seedBids() {
  console.log('💶 Seeding bids...');

  await db.insert(schema.bids).values([
    {
      lotId: 1,
      auctionId: 1,
      bidderId: 2,
      amount: '750.00',
      bidTime: new Date('2025-01-08T10:00:00.000Z'),
    },
    {
      lotId: 2,
      auctionId: 1,
      bidderId: 3,
      amount: '700.00',
      bidTime: new Date('2025-01-08T11:30:00.000Z'),
    },
    {
      lotId: 1,
      auctionId: 2,
      bidderId: 2,
      amount: '1200.00',
      bidTime: new Date('2025-01-21T09:30:00.000Z'),
    },
  ]);

  console.log('✅ Bids seeded\n');
}

async function seedContracts() {
  console.log('📄 Seeding contracts...');

  await db.insert(schema.contracts).values([
    {
      contractId: 1,
      auctionId: 1,
      providerId: 3, // Chloe als winnaar
      requesterId: 1,
      agreedPrice: '700.00',
      startDate: new Date('2025-01-15T08:00:00.000Z'),
      endDate: new Date('2025-01-16T18:00:00.000Z'),
      status: 'active',
    },
    {
      contractId: 2,
      auctionId: 2,
      providerId: 2,
      requesterId: 1,
      agreedPrice: '1200.00',
      startDate: new Date('2025-02-10T08:00:00.000Z'),
      endDate: new Date('2025-05-10T18:00:00.000Z'),
      status: 'active',
    },
  ]);

  console.log('✅ Contracts seeded\n');
}

async function seedInvoices() {
  console.log('📑 Seeding invoices...');

  await db.insert(schema.invoices).values([
    {
      invoiceId: 1,
      contractId: 1,
      amount: '700.00',
      issueDate: new Date('2025-01-17T09:00:00.000Z'),
      dueDate: new Date('2025-02-16T23:59:59.000Z'),
      status: 'unpaid',
    },
    {
      invoiceId: 2,
      contractId: 2,
      amount: '1200.00',
      issueDate: new Date('2025-02-15T09:00:00.000Z'),
      dueDate: new Date('2025-03-17T23:59:59.000Z'),
      status: 'paid',
    },
  ]);

  console.log('✅ Invoices seeded\n');
}

async function seedReviews() {
  console.log('⭐ Seeding reviews...');

  await db.insert(schema.reviews).values([
    {
      reviewId: 1,
      contractId: 1,
      reviewerId: 1, // requester Anna
      reviewedUserId: 3, // provider Chloe
      rating: 5,
      comment: 'Zeer vlotte samenwerking, transport perfect uitgevoerd.',
      createdAt: new Date('2025-01-18T10:00:00.000Z'),
    },
    {
      reviewId: 2,
      contractId: 2,
      reviewerId: 1,
      reviewedUserId: 2,
      rating: 4,
      comment: 'Opslag was goed geregeld, communicatie kon iets sneller.',
      createdAt: new Date('2025-02-20T14:30:00.000Z'),
    },
  ]);

  console.log('✅ Reviews seeded\n');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();

  await seedCompanies();
  await seedUsers();
  await seedAuctions();
  await seedLots();
  await seedBids();
  await seedContracts();
  await seedInvoices();
  await seedReviews();

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await connection.end();
  })
  .catch(async (e) => {
    console.error(e);
    await connection.end();
    process.exit(1);
  });
