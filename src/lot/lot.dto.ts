export class CreateLotDto {
  request_id: string;
  requester_id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  winner_id: string | null;
  category: string;
  reserved_price: number;
  buy_price: number;
  start_bid: number;
  status: string;
  extra_information?: string;
  is_reversed: boolean;
  can_bid_higher: boolean;
}

export class LotResponseDto extends CreateLotDto {
  lot_id: string;
  created_at: Date;
}

export class LotListResponseDto {
  items: LotResponseDto[];
}
