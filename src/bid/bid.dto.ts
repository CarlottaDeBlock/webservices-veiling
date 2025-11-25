export class CreateBidDto {
  auction_id: string;
  bidder_id: string;
  amount: number;
}

export class BidResponseDto extends CreateBidDto {
  bid_id: string;
  bid_time: Date;
}

export class BidListResponseDto {
  items: BidResponseDto[];
}
