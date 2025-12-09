import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  ReviewListResponseDto,
  ReviewResponseDto,
} from './review.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll(@CurrentUser() user: Session): Promise<ReviewListResponseDto> {
    return this.reviewService.getAll(user);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.getById(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.create(createReviewDto, user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: CreateReviewDto,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.updateById(id, updateReviewDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    await this.reviewService.deleteById(id, user);
  }
}
