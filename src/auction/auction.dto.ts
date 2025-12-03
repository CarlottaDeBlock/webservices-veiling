export type AuctionStatus = 'open' | 'closed' | 'cancelled';

export class CreateAuctionRequestDto {
  requestId: number;
  startTime: Date;
  endTime: Date;
  status: AuctionStatus;
}

export class AuctionResponseDto extends CreateAuctionRequestDto {
  auctionId: number;
  createdAt: Date;
}

export class AuctionListResponseDto {
  items: AuctionResponseDto[];
}
