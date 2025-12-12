import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { IsString } from 'nestjs-swagger-dto';

export type CompanyStatus = 'active' | 'inactive';

export class CreateCompanyDto {
  @IsString({
    name: 'name',
    description: 'Name of the company',
    maxLength: 255,
  })
  @ApiProperty({
    example: 'Cool Provider BV',
    description: 'Name of the company',
  })
  name: string;

  @IsString({
    name: 'vatNumber',
    description: 'VAT number of the company',
    maxLength: 32,
  })
  @Matches(/^BE[0-9]{10}$/, {
    message: 'vatNumber must be a valid Belgian VAT number',
  })
  @ApiProperty({
    example: 'BE0123456789',
    description: 'VAT number of the company',
  })
  vatNumber: string;

  @IsString({
    name: 'address',
    description: 'Street and number',
    maxLength: 255,
  })
  @ApiProperty({
    example: 'Kouter 1',
    description: 'Street and number of the company',
  })
  address: string;

  @IsString({
    name: 'city',
    description: 'City',
    maxLength: 100,
  })
  @ApiProperty({
    example: 'Gent',
    description: 'City of the company',
  })
  city: string;

  @IsString({
    name: 'country',
    description: 'Country code (ISO-2)',
    maxLength: 100,
  })
  @ApiProperty({
    example: 'BE',
    description: 'Country code (ISO-2)',
  })
  country: string;

  @IsString({
    name: 'status',
    description: 'Status of the company',
  })
  @ApiProperty({
    example: 'active',
    description: 'Status of the company',
    enum: ['active', 'inactive'],
  })
  status: CompanyStatus;

  @IsString({
    name: 'peppolId',
    description: 'PEPPOL identifier of the company',
    maxLength: 64,
  })
  @ApiProperty({
    example: '0210:1234567890',
    description: 'PEPPOL identifier of the company',
  })
  peppolId: string;

  @IsString({
    name: 'invoiceEmail',
    description: 'Email address for invoices',
    maxLength: 255,
    optional: true,
  })
  @ApiProperty({
    example: 'facturen@coolprovider.be',
    description: 'Email address used for sending invoices',
    nullable: true,
  })
  invoiceEmail: string | null;
}

export class CompanyResponseDto extends CreateCompanyDto {
  @ApiProperty({ example: 1, description: 'ID of the company' })
  companyId: number;

  @ApiProperty({
    example: '2025-09-12T08:55:15.039Z',
    description: 'Creation timestamp of the company',
  })
  createdAt: Date;
}

export class CompanyListResponseDto {
  @ApiProperty({ type: () => [CompanyResponseDto] })
  items: CompanyResponseDto[];
}
