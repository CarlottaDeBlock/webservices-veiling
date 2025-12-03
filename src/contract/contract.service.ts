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
import { eq } from 'drizzle-orm';
import { contracts } from '../drizzle/schema';

@Injectable()
export class ContractService {
  async getAll(): Promise<ContractListResponseDto> {
    const items = await this.db.query.contracts.findMany();
    return { items };
  }

  async getById(id: number): Promise<ContractResponseDto> {
    const contract = await this.db.query.contracts.findFirst({
      where: eq(contracts.contractId, id),
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
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

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(contracts)
      .where(eq(contracts.contractId, id));
    if (result.affectedRows === 0) {
      throw new NotFoundException('Contract not found');
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
