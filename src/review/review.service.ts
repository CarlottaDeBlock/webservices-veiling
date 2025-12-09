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
import { reviews } from '../drizzle/schema';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  private async ensureCanAccessReview(id: number, session: Session) {
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (isAdmin) return;

    const review = await this.db.query.reviews.findFirst({
      where: eq(reviews.reviewId, id),
    });

    if (
      !review ||
      (review.reviewerId !== session.id && review.reviewedUserId !== session.id)
    ) {
      throw new NotFoundException('Review not found');
    }
  }

  async getAll(session: Session): Promise<ReviewListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    const items = await this.db.query.reviews.findMany({
      where: isAdmin
        ? undefined
        : or(
            eq(reviews.reviewerId, session.id),
            eq(reviews.reviewedUserId, session.id),
          ),
      with: {
        contract: true,
        reviewer: true,
        reviewedUser: true,
      },
    });
    return { items };
  }

  async getById(id: number, session: Session): Promise<ReviewResponseDto> {
    await this.ensureCanAccessReview(id, session);
    const review = await this.db.query.reviews.findFirst({
      where: eq(reviews.reviewId, id),
      with: {
        contract: true,
        reviewer: true,
        reviewedUser: true,
      },
    });

    if (!review) {
      throw new NotFoundException({
        message: 'Review not found',
        details: { id },
      });
    }
    return review;
  }

  async create(
    data: CreateReviewDto,
    session: Session,
  ): Promise<ReviewResponseDto> {
    const [inserted] = await this.db
      .insert(reviews)
      .values({
        contractId: data.contractId,
        reviewerId: session.id,
        reviewedUserId: data.reviewedUserId,
        rating: data.rating,
        comment: data.comment,
      })
      .$returningId();

    return this.getById(inserted.reviewId, session);
  }

  async updateById(
    id: number,
    data: CreateReviewDto,
    session: Session,
  ): Promise<ReviewResponseDto> {
    await this.ensureCanAccessReview(id, session);
    await this.db
      .update(reviews)
      .set({
        contractId: data.contractId,
        reviewerId: session.id,
        reviewedUserId: data.reviewedUserId,
        rating: data.rating,
        comment: data.comment,
      })
      .where(eq(reviews.reviewId, id));

    return this.getById(id, session);
  }

  async deleteById(id: number, session: Session): Promise<void> {
    await this.ensureCanAccessReview(id, session);
    const [result] = await this.db
      .delete(reviews)
      .where(eq(reviews.reviewId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Review not found',
        details: { id },
      });
    }
  }
}
