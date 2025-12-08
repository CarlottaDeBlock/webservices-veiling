import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BidWithUserResponseDto } from '../bid/bid.dto';

export class CreateLotDto {
  @IsInt()
  @Min(1)
  requestId: number;

  @IsInt()
  @Min(1)
  requesterId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  startTime: Date;

  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  @IsInt()
  winnerId: number | null;

  @IsString()
  category: string;

  @IsString()
  reservedPrice: string;

  @IsOptional()
  @IsString()
  buyPrice: string | null;

  @IsString()
  startBid: string;

  @IsString()
  status: 'open' | 'closed' | 'cancelled';

  @IsOptional()
  @IsString()
  extraInformation: string | null;

  @IsBoolean()
  isReversed: boolean;

  @IsBoolean()
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
