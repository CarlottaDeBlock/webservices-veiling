export class CreateCompanyDto {
  name: string;
  vat_number: string;
  address: string;
  city: string;
  country: string;
  status: string;
  peppol_id: string;
  invoice_email: string;
}

export class CompanyResponseDto extends CreateCompanyDto {
  company_id: string;
  created_at: Date;
}

export class CompanyListResponseDto {
  items: CompanyResponseDto[];
}
