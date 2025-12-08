import { IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export type ContractStatus = 'active' | 'completed' | 'cancelled';

export class CreateContractDto {
  @IsInt()
  @Min(1)
  auctionId: number;

  @IsInt()
  @Min(1)
  providerId: number;

  @IsInt()
  @Min(1)
  requesterId: number;

  @IsString()
  agreedPrice: string;

  @Type(() => Date)
  startDate: Date;

  @Type(() => Date)
  endDate: Date;

  @IsEnum(['active', 'completed', 'cancelled'])
  status: ContractStatus;
}

export class ContractResponseDto extends CreateContractDto {
  contractId: number;
}

export class ContractListResponseDto {
  items: ContractResponseDto[];
}
