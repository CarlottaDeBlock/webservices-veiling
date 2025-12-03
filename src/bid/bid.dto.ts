import { PublicUserResponseDto } from '../user/user.dto';

export class CreateBidDto {
  auctionId: number;
  bidderId: number;
  amount: string;
}

export class BidResponseDto extends CreateBidDto {
  bidId: number;
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
  auctionId: number;
  bidderId: number;
  amount: string;
}
