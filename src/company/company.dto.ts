export type CompanyStatus = 'active' | 'inactive';

export class CreateCompanyDto {
  name: string;
  vatNumber: string;
  address: string;
  city: string;
  country: string;
  status: CompanyStatus;
  peppolId: string;
  invoiceEmail: string | null;
}

export class CompanyResponseDto extends CreateCompanyDto {
  companyId: number;
  createdAt: Date;
}

export class CompanyListResponseDto {
  items: CompanyResponseDto[];
}
