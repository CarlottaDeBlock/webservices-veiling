import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export type CompanyStatus = 'active' | 'inactive';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  vatNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @IsEnum(['active', 'inactive'])
  status: CompanyStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  peppolId: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  invoiceEmail: string | null;
}

export class CompanyResponseDto extends CreateCompanyDto {
  companyId: number;
  createdAt: Date;
}

export class CompanyListResponseDto {
  items: CompanyResponseDto[];
}
