import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateReviewDto,
  ReviewListResponseDto,
  ReviewResponseDto,
} from './review.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { reviews } from '../drizzle/schema';

@Injectable()
export class ReviewService {
  async getAll(): Promise<ReviewListResponseDto> {
    const items = await this.db.query.reviews.findMany();
    return { items };
  }

  async getById(id: number): Promise<ReviewResponseDto> {
    const review = await this.db.query.reviews.findFirst({
      where: eq(reviews.reviewId, id),
    });

    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async create(data: CreateReviewDto): Promise<ReviewResponseDto> {
    const [inserted] = await this.db
      .insert(reviews)
      .values({
        contractId: data.contractId,
        reviewerId: data.reviewerId,
        reviewedUserId: data.reviewedUserId,
        rating: data.rating,
        comment: data.comment,
      })
      .$returningId(); // { reviewId: number }

    const row = await this.db.query.reviews.findFirst({
      where: eq(reviews.reviewId, inserted.reviewId),
    });

    if (!row) {
      throw new Error('Failed to load created review');
    }

    return row;
  }

  async updateById(
    id: number,
    data: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    await this.db
      .update(reviews)
      .set({
        contractId: data.contractId,
        reviewerId: data.reviewerId,
        reviewedUserId: data.reviewedUserId,
        rating: data.rating,
        comment: data.comment,
      })
      .where(eq(reviews.reviewId, id));

    const row = await this.db.query.reviews.findFirst({
      where: eq(reviews.reviewId, id),
    });

    if (!row) {
      throw new NotFoundException('Review not found');
    }

    return row;
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(reviews)
      .where(eq(reviews.reviewId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Auction not found');
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
