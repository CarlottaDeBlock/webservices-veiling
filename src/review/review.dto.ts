export class CreateReviewDto {
  contractId: number;
  reviewerId: number;
  reviewedUserId: number;
  rating: number;
  comment: string | null;
}

export class ReviewResponseDto extends CreateReviewDto {
  reviewId: number;
  createdAt: Date;
}

export class ReviewListResponseDto {
  items: ReviewResponseDto[];
}
