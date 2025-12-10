import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'nestjs-swagger-dto';

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export class CreateInvoiceDto {
  @IsNumber({
    name: 'contractId',
    description: 'ID of the related contract',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 1,
    description: 'ID of the related contract',
  })
  contractId: number;

  @IsString({
    name: 'amount',
    description: 'Invoice amount as string',
  })
  @ApiProperty({
    example: '1200.00',
    description: 'Invoice amount',
  })
  amount: string;

  @Type(() => Date)
  @IsString({
    name: 'issueDate',
    description: 'Issue date in ISO format',
  })
  @ApiProperty({
    example: '2025-10-01T00:00:00.000Z',
    description: 'Date when the invoice was issued',
  })
  issueDate: Date;

  @Type(() => Date)
  @IsString({
    name: 'dueDate',
    description: 'Due date in ISO format',
  })
  @ApiProperty({
    example: '2025-10-31T00:00:00.000Z',
    description: 'Date when the invoice is due',
  })
  dueDate: Date;

  @IsString({
    name: 'status',
    description: 'Status of the invoice',
  })
  @ApiProperty({
    example: 'unpaid',
    description: 'Status of the invoice',
    enum: ['unpaid', 'paid', 'overdue'],
  })
  status: InvoiceStatus;
}

export class InvoiceResponseDto extends CreateInvoiceDto {
  @ApiProperty({ example: 1, description: 'ID of the invoice' })
  invoiceId: number;
}

export class InvoiceListResponseDto {
  @ApiProperty({ type: () => [InvoiceResponseDto] })
  items: InvoiceResponseDto[];
}
