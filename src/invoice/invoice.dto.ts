export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export class CreateInvoiceDto {
  contractId: number;
  amount: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
}

export class InvoiceResponseDto extends CreateInvoiceDto {
  invoiceId: number;
}

export class InvoiceListResponseDto {
  items: InvoiceResponseDto[];
}
