import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { companies, users } from '../drizzle/schema';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';

@Injectable()
export class CompanyService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  private async ensureUserCanAccessCompany(
    companyId: number,
    session: Session,
  ): Promise<void> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (isAdmin) return;
    const user = await this.db.query.users.findFirst({
      where: eq(users.userId, session.id),
    });
    if (!user || user.companyId !== companyId) {
      throw new ForbiddenException('You do not have access to this company');
    }
  }
  async getAll(session: Session): Promise<CompanyListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isAdmin) {
      const user = await this.db.query.users.findFirst({
        where: eq(users.userId, session.id),
      });
      if (!user || !user.companyId) {
        return { items: [] };
      }
      const company = await this.db.query.companies.findFirst({
        where: eq(companies.companyId, user.companyId),
      });
      return { items: company ? [company] : [] };
    }
    const items = await this.db.query.companies.findMany({
      with: {
        users: true,
      },
    });
    return { items };
  }

  async getById(id: number, session: Session): Promise<CompanyResponseDto> {
    await this.ensureUserCanAccessCompany(id, session);
    const company = await this.db.query.companies.findFirst({
      where: eq(companies.companyId, id),
      with: {
        users: true,
      },
    });
    if (!company) {
      throw new NotFoundException({
        message: 'Company not found',
        details: { id },
      });
    }
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
    session: Session,
  ): Promise<CompanyResponseDto> {
    await this.ensureUserCanAccessCompany(id, session);
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

    return this.getById(id, session);
  }

  async deleteById(id: number, session: Session): Promise<void> {
    await this.ensureUserCanAccessCompany(id, session);
    const [result] = await this.db
      .delete(companies)
      .where(eq(companies.companyId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Company not found',
        details: { id },
      });
    }
  }
}
