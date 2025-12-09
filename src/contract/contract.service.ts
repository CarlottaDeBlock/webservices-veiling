import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
} from './contract.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq, or } from 'drizzle-orm';
import { contracts } from '../drizzle/schema';
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
    if (
      !contract ||
      (contract.providerId !== session.id &&
        contract.requesterId !== session.id)
    ) {
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

  async getById(id: number, session: Session): Promise<ContractResponseDto> {
    await this.ensureCanAccessContract(id, session);
    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, id),
      with: {
        auction: true,
        provider: true,
        requester: true,
        invoice: true,
        reviews: true,
      },
    });
    if (!contract) {
      throw new NotFoundException({
        message: 'Contract not found',
        details: { id },
      });
    }
    return contract;
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
    data: CreateContractDto,
  ): Promise<ContractResponseDto> {
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

  async deleteById(id: number): Promise<void> {
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
}
