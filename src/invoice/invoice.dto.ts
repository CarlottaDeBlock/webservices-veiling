export class CreateInvoiceDto {
  contract_id: string;
  amount: number;
  issue_date: Date;
  due_date: Date;
  status: string;
}

export class InvoiceResponseDto extends CreateInvoiceDto {
  invoice_id: string;
}

export class InvoiceListResponseDto {
  items: InvoiceResponseDto[];
}
