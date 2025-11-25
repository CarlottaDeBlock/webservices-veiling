import { Injectable, NotFoundException } from '@nestjs/common';
import { REVIEWS, Review } from '../data/mock_data';
import {
  CreateReviewDto,
  ReviewListResponseDto,
  ReviewResponseDto,
} from './review.dto';

@Injectable()
export class ReviewService {
  getAll(): ReviewListResponseDto {
    return { items: REVIEWS };
  }

  getById(id: string): ReviewResponseDto {
    const review = REVIEWS.find((r) => r.review_id === id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  create(data: CreateReviewDto): ReviewResponseDto {
    const newReview: Review = {
      ...data,
      review_id: String(Date.now()),
      created_at: new Date(),
    };
    REVIEWS.push(newReview);
    return newReview;
  }

  updateById(id: string, data: CreateReviewDto): ReviewResponseDto {
    const index = REVIEWS.findIndex((r) => r.review_id === id);
    if (index === -1) throw new NotFoundException('Review not found');
    REVIEWS[index] = { ...REVIEWS[index], ...data };
    return REVIEWS[index];
  }

  deleteById(id: string): void {
    const index = REVIEWS.findIndex((r) => r.review_id === id);
    if (index === -1) throw new NotFoundException('Review not found');
    REVIEWS.splice(index, 1);
  }
}
