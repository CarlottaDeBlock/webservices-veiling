import { IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export class CreateInvoiceDto {
  @IsInt()
  @Min(1)
  contractId: number;

  @IsString()
  amount: string;

  @Type(() => Date)
  issueDate: Date;

  @Type(() => Date)
  dueDate: Date;

  @IsEnum(['unpaid', 'paid', 'overdue'])
  status: InvoiceStatus;
}

export class InvoiceResponseDto extends CreateInvoiceDto {
  invoiceId: number;
}

export class InvoiceListResponseDto {
  items: InvoiceResponseDto[];
}
