export class CreateBidDto {
  auctionId: number;
  bidderId: number;
  amount: string;
}

export class BidResponseDto extends CreateBidDto {
  bidId: number;
  bidTime: Date;
}

export class BidListResponseDto {
  items: BidResponseDto[];
}
