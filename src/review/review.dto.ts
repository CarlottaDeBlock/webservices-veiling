export class CreateReviewDto {
  contract_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string;
}

export class ReviewResponseDto extends CreateReviewDto {
  review_id: string;
  created_at: Date;
}

export class ReviewListResponseDto {
  items: ReviewResponseDto[];
}
