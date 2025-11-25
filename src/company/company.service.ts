import { Injectable, NotFoundException } from '@nestjs/common';
import { COMPANIES, Company } from '../data/mock_data';
import {
  CreateCompanyDto,
  CompanyListResponseDto,
  CompanyResponseDto,
} from './company.dto';

@Injectable()
export class CompanyService {
  getAll(): CompanyListResponseDto {
    return { items: COMPANIES };
  }

  getById(id: string): CompanyResponseDto {
    const company = COMPANIES.find((c) => c.company_id === id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  create(data: CreateCompanyDto): CompanyResponseDto {
    const newCompany: Company = {
      ...data,
      company_id: String(Date.now()),
      created_at: new Date(),
    };
    COMPANIES.push(newCompany);
    return newCompany;
  }

  updateById(id: string, data: CreateCompanyDto): CompanyResponseDto {
    const index = COMPANIES.findIndex((c) => c.company_id === id);
    if (index === -1) throw new NotFoundException('Company not found');
    COMPANIES[index] = { ...COMPANIES[index], ...data };
    return COMPANIES[index];
  }

  deleteById(id: string): void {
    const index = COMPANIES.findIndex((c) => c.company_id === id);
    if (index === -1) throw new NotFoundException('Company not found');
    COMPANIES.splice(index, 1);
  }
}
