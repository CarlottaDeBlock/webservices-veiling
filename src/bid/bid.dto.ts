import { PublicUserResponseDto } from '../user/user.dto';
import { IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @IsInt()
  @Min(1)
  auctionId: number;

  @IsInt()
  @Min(1)
  bidderId: number;

  @IsString()
  amount: string;
}

export class BidResponseDto extends CreateBidDto {
  bidId: number;

  @Type(() => Date)
  bidTime: Date;
}

export class BidWithUserResponseDto {
  bidId: number;
  amount: string;
  bidTime: Date;
  bidder: PublicUserResponseDto;
}

export class BidListResponseDto {
  items: BidResponseDto[];
}

export class UpdateBidDto {
  @IsInt()
  @Min(1)
  auctionId: number;

  @IsInt()
  @Min(1)
  bidderId: number;

  @IsString()
  amount: string;
}
