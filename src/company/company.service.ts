import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCompanyDto,
  CompanyListResponseDto,
  CompanyResponseDto,
} from './company.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { companies } from '../drizzle/schema';

@Injectable()
export class CompanyService {
  async getAll(): Promise<CompanyListResponseDto> {
    const items = await this.db.query.companies.findMany();
    return { items };
  }

  async getById(id: number): Promise<CompanyResponseDto> {
    const company = await this.db.query.companies.findFirst({
      where: eq(companies.companyId, id),
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: CreateCompanyDto): Promise<CompanyResponseDto> {
    const [inserted] = await this.db
      .insert(companies)
      .values({
        name: data.name,
        vatNumber: data.vatNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        status: data.status,
        peppolId: data.peppolId,
        invoiceEmail: data.invoiceEmail,
      })
      .$returningId();

    const company = await this.db.query.companies.findFirst({
      where: eq(companies.companyId, inserted.companyId),
    });

    if (!company) {
      throw new Error('Failed to load created company');
    }
    return company;
  }

  async updateById(
    id: number,
    data: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    await this.db
      .update(companies)
      .set({
        name: data.name,
        vatNumber: data.vatNumber,
        address: data.address,
        city: data.city,
        country: data.country,
        status: data.status,
        peppolId: data.peppolId,
        invoiceEmail: data.invoiceEmail,
      })
      .where(eq(companies.companyId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(companies)
      .where(eq(companies.companyId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Auction not found');
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
