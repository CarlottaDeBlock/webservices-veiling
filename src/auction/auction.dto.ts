export class CreateAuctionRequestDto {
  request_id: string;
  start_time: Date;
  end_time: Date;
  status: string;
  category: string;
}

export class AuctionResponseDto extends CreateAuctionRequestDto {
  auction_id: string;
  created_at: Date;
}

export class AuctionListResponseDto {
  items: AuctionResponseDto[];
}
