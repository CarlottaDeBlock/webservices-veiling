import {
  IsInt,
  Min,
  IsString,
  IsOptional,
  Min as MinVal,
  Max as MaxVal,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  contractId: number;

  @IsInt()
  @Min(1)
  reviewerId: number;

  @IsInt()
  @Min(1)
  reviewedUserId: number;

  @IsInt()
  @MinVal(1)
  @MaxVal(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment: string | null;
}

export class ReviewResponseDto extends CreateReviewDto {
  reviewId: number;
  @Type(() => Date)
  createdAt: Date;
}

export class ReviewListResponseDto {
  items: ReviewResponseDto[];
}
