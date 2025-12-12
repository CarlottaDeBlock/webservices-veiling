import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { IsDate, IsNumber as IsNumberCv, Min } from 'class-validator';

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export class CreateInvoiceDto {
  @IsNumberCv()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'ID of the related contract',
  })
  contractId: number;

  @IsNumberCv()
  @Min(0.01)
  @ApiProperty({
    example: 1200.0,
    description: 'Invoice amount',
  })
  amount: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '2025-10-01T00:00:00.000Z',
    description: 'Date when the invoice was issued',
  })
  issueDate: Date;

  @Type(() => Date)
  @IsDate()
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
