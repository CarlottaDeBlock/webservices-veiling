import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';
import { invoices } from '../drizzle/schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  private async ensureCanAccessInvoice(id: number, session: Session) {
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (isAdmin) return;

    const invoice = await this.db.query.invoices.findFirst({
      where: eq(invoices.invoiceId, id),
      with: { contract: true },
    });
    if (
      !invoice ||
      (invoice.contract.providerId !== session.id &&
        invoice.contract.requesterId !== session.id)
    ) {
      throw new NotFoundException({
        message: 'Invoice not found',
        details: { id },
      });
    }
  }

  async getAll(session: Session): Promise<InvoiceListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);

    const rows = await this.db.query.invoices.findMany({
      with: { contract: true },
    });

    const filtered = isAdmin
      ? rows
      : rows.filter(
          (inv) =>
            inv.contract &&
            (inv.contract.providerId === session.id ||
              inv.contract.requesterId === session.id),
        );

    const items: InvoiceResponseDto[] = filtered.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    return { items };
  }

  async getById(id: number, session: Session): Promise<InvoiceResponseDto> {
    await this.ensureCanAccessInvoice(id, session);
    const invoice = await this.db.query.invoices.findFirst({
      where: eq(invoices.invoiceId, id),
      with: {
        contract: true,
      },
    });
    if (!invoice) {
      throw new NotFoundException({
        message: 'Invoice not found',
        details: { id },
      });
    }
    return {
      ...invoice,
      amount: Number(invoice.amount),
    };
  }

  async create(data: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    const [inserted] = await this.db
      .insert(invoices)
      .values({
        contractId: data.contractId,
        amount: data.amount.toString(),
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        status: data.status,
      })
      .$returningId();

    const row = await this.db.query.invoices.findFirst({
      where: eq(invoices.invoiceId, inserted.invoiceId),
      with: { contract: true },
    });

    if (!row) {
      throw new Error('Failed to load created invoice');
    }

    return {
      ...row,
      amount: Number(row.amount),
    };
  }

  async updateById(
    id: number,
    data: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    await this.db
      .update(invoices)
      .set({
        contractId: data.contractId,
        amount: data.amount.toString(),
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        status: data.status,
      })
      .where(eq(invoices.invoiceId, id));

    const row = await this.db.query.invoices.findFirst({
      where: eq(invoices.invoiceId, id),
    });

    if (!row) {
      throw new NotFoundException({
        message: 'Invoice not found',
        details: { id },
      });
    }

    return {
      ...row,
      amount: Number(row.amount),
    };
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(invoices)
      .where(eq(invoices.invoiceId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Invoice not found',
        details: { id },
      });
    }
  }
}
