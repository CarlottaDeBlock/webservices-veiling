import { Injectable, NotFoundException } from '@nestjs/common';
import { CONTRACTS, Contract } from '../data/mock_data';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
} from './contract.dto';

@Injectable()
export class ContractService {
  getAll(): ContractListResponseDto {
    return { items: CONTRACTS };
  }

  getById(id: string): ContractResponseDto {
    const contract = CONTRACTS.find((c) => c.contract_id === id);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  create(data: CreateContractDto): ContractResponseDto {
    const newContract: Contract = {
      ...data,
      contract_id: String(Date.now()),
    };
    CONTRACTS.push(newContract);
    return newContract;
  }

  updateById(id: string, data: CreateContractDto): ContractResponseDto {
    const index = CONTRACTS.findIndex((c) => c.contract_id === id);
    if (index === -1) {
      throw new NotFoundException('Contract not found');
    }
    CONTRACTS[index] = { ...CONTRACTS[index], ...data };
    return CONTRACTS[index];
  }

  deleteById(id: string): void {
    const index = CONTRACTS.findIndex((c) => c.contract_id === id);
    if (index === -1) {
      throw new NotFoundException('Contract not found');
    }
    CONTRACTS.splice(index, 1);
  }
}
