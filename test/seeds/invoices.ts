import type { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { invoices } from '../../src/drizzle/schema';

export const INVOICES_SEED: (typeof invoices.$inferInsert)[] = [
  {
    invoiceId: 1,
    contractId: 1,
    issueDate: new Date('2025-09-20T08:00:00.000Z'),
    dueDate: new Date('2025-10-20T08:00:00.000Z'),
    amount: '650.00',
    status: 'unpaid',
  },
  {
    invoiceId: 2,
    contractId: 2,
    issueDate: new Date('2025-09-26T08:00:00.000Z'),
    dueDate: new Date('2025-10-26T08:00:00.000Z'),
    amount: '400.00',
    status: 'paid',
  },
];

export async function seedInvoices(drizzle: DatabaseProvider) {
  await drizzle.insert(invoices).values(INVOICES_SEED);
}

export async function clearInvoices(drizzle: DatabaseProvider) {
  await drizzle.delete(invoices);
}
