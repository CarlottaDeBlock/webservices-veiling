import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'nestjs-swagger-dto';
import { PublicUserResponseDto } from '../user/user.dto';

export class CreateBidDto {
  @IsNumber({
    name: 'auctionId',
    description: 'ID of the auction this bid belongs to',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 1,
    description: 'ID of the auction this bid belongs to',
  })
  auctionId: number;

  @IsString({
    name: 'amount',
    description: 'Bid amount as string',
  })
  @ApiProperty({
    example: '150.00',
    description: 'Bid amount',
  })
  amount: string;
}

export class UpdateBidDto {
  @IsNumber({
    name: 'auctionId',
    description: 'ID of the auction this bid belongs to',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 1,
    description: 'ID of the auction this bid belongs to',
  })
  auctionId: number;

  @IsString({
    name: 'amount',
    description: 'Bid amount as string',
  })
  @ApiProperty({
    example: '160.00',
    description: 'Updated bid amount',
  })
  amount: string;
}

export class BidResponseDto extends CreateBidDto {
  @ApiProperty({ example: 42, description: 'ID of the bid' })
  bidId: number;

  @Type(() => Date)
  @ApiProperty({
    example: '2025-09-12T09:15:00.000Z',
    description: 'Time when the bid was placed',
  })
  bidTime: Date;
}

export class BidWithUserResponseDto {
  @ApiProperty({ example: 42, description: 'ID of the bid' })
  bidId: number;

  @ApiProperty({ example: '150.00', description: 'Bid amount' })
  amount: string;

  @ApiProperty({
    example: '2025-09-12T09:15:00.000Z',
    description: 'Time when the bid was placed',
  })
  bidTime: Date;

  @ApiProperty({
    description: 'Public information of the bidder',
    type: () => PublicUserResponseDto,
  })
  bidder: PublicUserResponseDto;
}

export class BidListResponseDto {
  @ApiProperty({ type: () => [BidResponseDto] })
  items: BidResponseDto[];
}
