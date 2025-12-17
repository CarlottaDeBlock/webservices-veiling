import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
  UpdateContractDto,
} from './contract.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq, or } from 'drizzle-orm';
import { contracts, invoices } from '../drizzle/schema';
import { Role } from '../auth/roles';
import type { Session } from '../types/auth';

@Injectable()
export class ContractService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  private async ensureCanAccessContract(id: number, session: Session) {
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (isAdmin) return;

    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, id),
    });
    if (!contract) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }
    const isParticipant =
      contract.providerId === session.id || contract.requesterId === session.id;

    if (!isParticipant) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }
  }

  async getAll(session: Session): Promise<ContractListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    const items = await this.db.query.contracts.findMany({
      where: isAdmin
        ? undefined
        : or(
            eq(contracts.providerId, session.id),
            eq(contracts.requesterId, session.id),
          ),
      with: {
        auction: true,
        provider: true,
        requester: true,
        invoice: true,
        reviews: true,
      },
    });
    return { items };
  }

  async getById(id: number, user: Session): Promise<ContractResponseDto> {
    const row = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, id),
      with: {
        auction: true,
        provider: {
          with: { company: true },
        },
        requester: {
          with: { company: true },
        },
      },
    });

    if (!row) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }

    const isParty = row.providerId === user.id || row.requesterId === user.id;
    const isAdmin =
      Array.isArray(user.roles) && user.roles.includes(Role.ADMIN);
    if (!isParty && !isAdmin) {
      throw new ForbiddenException({
        message: 'You are not allowed to view this contract',
        details: { id },
      });
    }

    return {
      contractId: row.contractId,
      auctionId: row.auctionId,
      providerId: row.providerId,
      requesterId: row.requesterId,
      agreedPrice: row.agreedPrice,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      auction: row.auction,
      provider: row.provider,
      requester: row.requester,
    } as ContractResponseDto;
  }

  async create(data: CreateContractDto): Promise<ContractResponseDto> {
    const [inserted] = await this.db
      .insert(contracts)
      .values({
        auctionId: data.auctionId,
        providerId: data.providerId,
        requesterId: data.requesterId,
        agreedPrice: data.agreedPrice,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      })
      .$returningId();

    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, inserted.contractId),
    });

    if (!contract) {
      throw new Error('Failed to load created contract');
    }

    return contract;
  }

  async updateById(
    id: number,
    data: UpdateContractDto,
    session: Session,
  ): Promise<ContractResponseDto> {
    await this.ensureCanAccessContract(id, session);
    const allowedStatuses = [
      'pending',
      'active',
      'completed',
      'cancelled',
    ] as const;
    if (!allowedStatuses.includes(data.status as any)) {
      throw new BadRequestException({
        message: 'Invalid status',
        details: { body: { status: ['Status is not allowed'] } },
      });
    }
    await this.db
      .update(contracts)
      .set({
        auctionId: data.auctionId,
        providerId: data.providerId,
        requesterId: data.requesterId,
        agreedPrice: data.agreedPrice,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      })
      .where(eq(contracts.contractId, id));

    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, id),
    });

    if (!contract) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }

    return contract;
  }

  async deleteById(id: number, session: Session): Promise<void> {
    await this.ensureCanAccessContract(id, session);
    const [result] = await this.db
      .delete(contracts)
      .where(eq(contracts.contractId, id));
    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }
  }

  async acceptAndInvoice(
    contractId: number,
    user: Session,
  ): Promise<{ invoiceId: number }> {
    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, contractId),
    });

    if (!contract) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { contractId },
      });
    }

    const isParty =
      contract.providerId === user.id || contract.requesterId === user.id;
    if (!isParty) {
      throw new ForbiddenException({
        message: 'You are not allowed to accept this contract',
        details: { contractId },
      });
    }

    await this.db
      .update(contracts)
      .set({ status: 'active' })
      .where(eq(contracts.contractId, contractId));

    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 30);

    const [inserted] = await this.db
      .insert(invoices)
      .values(<typeof invoices.$inferInsert>{
        contractId,
        amount: contract.agreedPrice,
        issueDate: now,
        dueDate: due,
        status: 'unpaid',
      })
      .$returningId();

    return { invoiceId: inserted.invoiceId };
  }
}
