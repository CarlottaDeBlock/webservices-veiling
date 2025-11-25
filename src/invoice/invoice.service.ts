import { Injectable, NotFoundException } from '@nestjs/common';
import { INVOICES, Invoice } from '../data/mock_data';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';

@Injectable()
export class InvoiceService {
  getAll(): InvoiceListResponseDto {
    return { items: INVOICES };
  }

  getById(id: string): InvoiceResponseDto {
    const invoice = INVOICES.find((inv) => inv.invoice_id === id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  create(data: CreateInvoiceDto): InvoiceResponseDto {
    const newInvoice: Invoice = {
      ...data,
      invoice_id: String(Date.now()),
    };
    INVOICES.push(newInvoice);
    return newInvoice;
  }

  updateById(id: string, data: CreateInvoiceDto): InvoiceResponseDto {
    const index = INVOICES.findIndex((inv) => inv.invoice_id === id);
    if (index === -1) throw new NotFoundException('Invoice not found');
    INVOICES[index] = { ...INVOICES[index], ...data };
    return INVOICES[index];
  }

  deleteById(id: string): void {
    const index = INVOICES.findIndex((inv) => inv.invoice_id === id);
    if (index === -1) throw new NotFoundException('Invoice not found');
    INVOICES.splice(index, 1);
  }
}
