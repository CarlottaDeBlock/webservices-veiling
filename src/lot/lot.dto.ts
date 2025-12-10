import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BidWithUserResponseDto } from '../bid/bid.dto';
import { IsString, IsNumber, IsBoolean } from 'nestjs-swagger-dto';

export class CreateLotDto {
  @IsNumber({
    name: 'requestId',
    description: 'ID of the related request',
    min: 1,
    format: 'int32',
    type: 'integer',
  })
  @ApiProperty({ example: 10, description: 'ID of the related request' })
  requestId: number;

  @IsNumber({
    name: 'requesterId',
    description: 'ID of the requester (user)',
    min: 1,
    format: 'int32',
    type: 'integer',
  })
  @ApiProperty({ example: 3, description: 'ID of the requester (user)' })
  requesterId: number;

  @IsString({
    name: 'title',
    description: 'Title of the lot',
    maxLength: 255,
  })
  @ApiProperty({
    example: 'Transport of beer kegs',
    description: 'Title of the lot',
  })
  title: string;

  @IsString({
    name: 'description',
    description: 'Description of the lot',
  })
  @ApiProperty({
    example: 'Transport 50 kegs from Ghent to Brussels',
    description: 'Detailed description of the lot',
  })
  description: string;

  @Type(() => Date)
  @IsString({
    name: 'startTime',
    description: 'Start time in ISO format',
  })
  @ApiProperty({
    example: '2025-09-12T08:00:00.00Z',
    description: 'Start time of the lot',
  })
  startTime: Date;

  @Type(() => Date)
  @IsString({
    name: 'endTime',
    description: 'End time in ISO format',
  })
  @ApiProperty({
    example: '2025-09-13T08:00:00.000Z',
    description: 'End time of the lot',
  })
  endTime: Date;

  @IsNumber({
    name: 'winnerId',
    description: 'ID of the winning bidder, if any',
    min: 1,
    format: 'int32',
    type: 'integer',
    optional: true,
  })
  @ApiProperty({
    example: 5,
    description: 'ID of the winning bidder, if any',
    nullable: true,
  })
  winnerId: number | null;

  @IsString({
    name: 'category',
    description: 'Category of the lot',
  })
  @ApiProperty({
    example: 'Transport',
    description: 'Category of the lot',
  })
  category: string;

  @IsString({
    name: 'reservedPrice',
    description: 'Reserved price as string amount',
  })
  @ApiProperty({
    example: '500.00',
    description: 'Reserved price (string amount)',
  })
  reservedPrice: string;

  @IsString({
    name: 'buyPrice',
    description: 'Buy‑now price as string amount',
    optional: true,
  })
  @ApiProperty({
    example: '300.00',
    description: 'Buy-now price, if any',
    nullable: true,
  })
  buyPrice: string | null;

  @IsString({
    name: 'startBid',
    description: 'Starting bid amount',
  })
  @ApiProperty({
    example: '750.00',
    description: 'Starting bid amount',
  })
  startBid: string;

  @IsString({
    name: 'status',
    description: 'Status of the lot',
  })
  @ApiProperty({
    example: 'open',
    description: 'Status of the lot',
    enum: ['open', 'closed', 'cancelled'],
  })
  status: 'open' | 'closed' | 'cancelled';

  @IsString({
    name: 'extraInformation',
    description: 'Extra information about the lot',
    optional: true,
  })
  @ApiProperty({
    example: 'Loading dock at 8:00AM',
    description: 'Extra information about the lot',
    nullable: true,
  })
  extraInformation: string | null;

  @IsBoolean({
    name: 'isReversed',
    description: 'Whether this is a reversed auction',
  })
  @ApiProperty({
    example: true,
    description: 'Whether this is a reversed auction (bidding lower)',
  })
  isReversed: boolean;

  @IsBoolean({
    name: 'canBidHigher',
    description: 'Whether bidders can place higher bids',
  })
  @ApiProperty({
    example: true,
    description:
      'Whether bidders can place higher bids (even if it is a reversed auction)',
  })
  canBidHigher: boolean;
}

export class LotResponseDto extends CreateLotDto {
  @ApiProperty({ example: 1, description: 'ID of the lot' })
  lotId: number;

  @ApiProperty({
    example: '2025-09-12T08:55:15.039Z',
    description: 'Creation timestamp of the lot',
  })
  createdAt: Date;
}

export class LotListResponseDto {
  @ApiProperty({ type: () => [LotResponseDto] })
  items: LotResponseDto[];
}

export class LotDetailResponseDto extends LotResponseDto {
  @ApiProperty({
    type: () => [BidWithUserResponseDto],
    description: 'Bids placed on this lot',
  })
  bids: BidWithUserResponseDto[];
}
