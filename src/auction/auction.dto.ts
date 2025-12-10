import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';

export type AuctionStatus = 'open' | 'closed' | 'cancelled';

export class CreateAuctionRequestDto {
  @IsNumber({
    name: 'requestId',
    description: 'ID of the related request',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 10,
    description: 'ID of the related request',
  })
  requestId: number;

  @Type(() => Date)
  @IsString({
    name: 'startTime',
    description: 'Auction start time in ISO format',
  })
  @ApiProperty({
    example: '2025-09-12T08:00:00.000Z',
    description: 'Start time of the auction',
  })
  startTime: Date;

  @Type(() => Date)
  @IsString({
    name: 'endTime',
    description: 'Auction end time in ISO format',
  })
  @ApiProperty({
    example: '2025-09-13T08:00:00.000Z',
    description: 'End time of the auction',
  })
  endTime: Date;

  @IsString({
    name: 'status',
    description: 'Status of the auction',
  })
  @ApiProperty({
    example: 'open',
    description: 'Status of the auction',
    enum: ['open', 'closed', 'cancelled'],
  })
  status: AuctionStatus;
}

export class AuctionResponseDto extends CreateAuctionRequestDto {
  @ApiProperty({ example: 1, description: 'Auction ID' })
  auctionId: number;

  @ApiProperty({
    example: '2025-09-12T08:55:15.039Z',
    description: 'Creation timestamp of the auction',
  })
  createdAt: Date;
}

export class AuctionListResponseDto {
  @ApiProperty({ type: () => [AuctionResponseDto] })
  items: AuctionResponseDto[];
}
