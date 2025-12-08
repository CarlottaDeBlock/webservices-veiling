import { IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export type AuctionStatus = 'open' | 'closed' | 'cancelled';

export class CreateAuctionRequestDto {
  @IsInt()
  @Min(1)
  requestId: number;

  @Type(() => Date)
  startTime: Date;

  @Type(() => Date)
  endTime: Date;

  @IsEnum(['open', 'closed', 'cancelled'])
  status: AuctionStatus;
}

export class AuctionResponseDto extends CreateAuctionRequestDto {
  auctionId: number;
  createdAt: Date;
}

export class AuctionListResponseDto {
  items: AuctionResponseDto[];
}
