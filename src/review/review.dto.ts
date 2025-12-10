import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'nestjs-swagger-dto';

export class CreateReviewDto {
  @IsNumber({
    name: 'contractId',
    description: 'ID of the related contract',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 1,
    description: 'ID of the related contract',
  })
  contractId: number;

  @IsNumber({
    name: 'reviewerId',
    description: 'ID of the reviewer (user)',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 3,
    description: 'ID of the reviewer (user)',
  })
  reviewerId: number;

  @IsNumber({
    name: 'reviewedUserId',
    description: 'ID of the reviewed user',
    min: 1,
    type: 'integer',
  })
  @ApiProperty({
    example: 5,
    description: 'ID of the reviewed user',
  })
  reviewedUserId: number;

  @IsNumber({
    name: 'rating',
    description: 'Rating from 1 to 5',
    min: 1,
    max: 5,
    type: 'integer',
  })
  @ApiProperty({
    example: 4,
    description: 'Rating from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @IsString({
    name: 'comment',
    description: 'Optional comment',
    optional: true,
  })
  @ApiProperty({
    example: 'Very reliable provider',
    description: 'Optional comment about the contract',
    nullable: true,
  })
  comment: string | null;
}

export class ReviewResponseDto extends CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID of the review' })
  reviewId: number;

  @Type(() => Date)
  @ApiProperty({
    example: '2025-10-01T12:00:00.000Z',
    description: 'Creation timestamp of the review',
  })
  createdAt: Date;
}

export class ReviewListResponseDto {
  @ApiProperty({ type: () => [ReviewResponseDto] })
  items: ReviewResponseDto[];
}
