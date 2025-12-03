import { BidWithUserResponseDto } from '../bid/bid.dto';

export class CreateLotDto {
  requestId: number;
  requesterId: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  winnerId: number | null;
  category: string;
  reservedPrice: string;
  buyPrice: string | null;
  startBid: string;
  status: 'open' | 'closed' | 'cancelled';
  extraInformation: string | null;
  isReversed: boolean;
  canBidHigher: boolean;
}

export class LotResponseDto extends CreateLotDto {
  lotId: number;
  createdAt: Date;
}

export class LotListResponseDto {
  items: LotResponseDto[];
}

export class LotDetailResponseDto extends LotResponseDto {
  bids: BidWithUserResponseDto[];
}
