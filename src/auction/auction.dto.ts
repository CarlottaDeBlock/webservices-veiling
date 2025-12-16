import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsDate, IsOptional } from 'class-validator';

export type AuctionStatus = 'open' | 'closed' | 'cancelled';
export type AuctionCategory =
  | 'Transport'
  | 'Horeca'
  | 'Rollend Materiaal'
  | 'Vastgoed';

export class CreateAuctionRequestDto {
  @IsNumber({
    name: 'requesterId',
    description: 'ID of the requester (user)',
    min: 1,
    format: 'int32',
    type: 'integer',
  })
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'ID of the related requester (user)',
  })
  requesterId?: number;

  @IsString({
    name: 'category',
    description: 'Category of the auction',
  })
  @ApiProperty({
    example: 'Transport',
    description: 'Category of the auction',
    enum: ['Transport', 'Horeca', 'Rollend Materiaal', 'Vastgoed'],
  })
  category: AuctionCategory;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '2025-09-12T08:00:00.000Z',
    description: 'Start time of the auction',
  })
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '2025-09-13T08:00:00.000Z',
    description: 'End time of the auction',
  })
  endTime: Date;

  @IsString({
    name: 'title',
    description: 'Title of the auction',
    maxLength: 255,
  })
  @ApiProperty({
    example: 'Transport auction ',
    description: 'Title of the auction',
  })
  title: string;

  @IsString({
    name: 'status',
    description: 'Status of the auction',
  })
  @IsOptional()
  @ApiProperty({
    example: 'open',
    description: 'Status of the auction',
    enum: ['open', 'closed', 'cancelled'],
  })
  status?: AuctionStatus;
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
