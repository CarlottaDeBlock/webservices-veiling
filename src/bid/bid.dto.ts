import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PublicUserResponseDto } from '../user/user.dto';
import { IsNumber as IsNumberCv, IsOptional, Min } from 'class-validator';

export class CreateBidDto {
  @IsNumberCv()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'ID of the auction this bid belongs to',
  })
  auctionId: number;

  @IsNumberCv()
  @ApiProperty({
    example: 1,
    description: 'ID of the lot this bid belongs to',
  })
  lotId: number;

  @IsNumberCv()
  @Min(0.01)
  @ApiProperty({
    example: 150,
    description: 'Bid amount',
  })
  amount: number;
}

export class UpdateBidDto {
  @IsNumberCv()
  @ApiProperty({
    example: 1,
    description: 'ID of the auction this bid belongs to',
  })
  auctionId: number;

  @IsNumberCv()
  @ApiProperty({
    example: 1,
    description: 'ID of the lot this bid belongs to',
  })
  lotId: number;

  @IsNumberCv()
  @Min(0.01)
  @ApiProperty({
    example: 160,
    description: 'Updated bid amount',
  })
  amount: number;
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

  @ApiProperty({ example: 150, description: 'Bid amount' })
  amount: number;

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
