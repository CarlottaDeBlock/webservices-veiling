export type ContractStatus = 'active' | 'completed' | 'cancelled';

export class CreateContractDto {
  auctionId: number;
  providerId: number;
  requesterId: number;
  agreedPrice: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
}

export class ContractResponseDto extends CreateContractDto {
  contractId: number;
}

export class ContractListResponseDto {
  items: ContractResponseDto[];
}
