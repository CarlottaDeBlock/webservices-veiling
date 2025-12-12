import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'nestjs-swagger-dto';
import { IsDate } from 'class-validator';

export type ContractStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export class CreateContractDto {
  @IsNumber({
    name: 'auctionId',
    description: 'ID of the related auction',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 1,
    description: 'ID of the related auction',
  })
  auctionId: number;

  @IsNumber({
    name: 'providerId',
    description: 'ID of the provider (user)',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 3,
    description: 'ID of the provider (user)',
  })
  providerId: number;

  @IsNumber({
    name: 'requesterId',
    description: 'ID of the requester (user)',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 5,
    description: 'ID of the requester (user)',
  })
  requesterId: number;

  @IsString({
    name: 'agreedPrice',
    description: 'Agreed price as string amount',
  })
  @ApiProperty({
    example: '1200.00',
    description: 'Agreed price for the contract',
  })
  agreedPrice: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '2025-10-01T00:00:00.000Z',
    description: 'Start date of the contract',
  })
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '2025-12-31T00:00:00.000Z',
    description: 'End date of the contract',
  })
  endDate: Date;

  @IsString({
    name: 'status',
    description: 'Status of the contract',
  })
  @ApiProperty({
    example: 'active',
    description: 'Status of the contract',
    enum: ['pending', 'active', 'completed', 'cancelled'],
  })
  status: ContractStatus;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsString({ name: 'status', description: 'Status of the contract' })
  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'active', 'completed', 'cancelled'],
  })
  status: ContractStatus;
}

export class ContractResponseDto extends CreateContractDto {
  @ApiProperty({ example: 1, description: 'ID of the contract' })
  contractId: number;
}

export class ContractListResponseDto {
  @ApiProperty({ type: () => [ContractResponseDto] })
  items: ContractResponseDto[];
}
