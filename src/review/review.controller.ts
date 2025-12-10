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
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reviews')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all reviews visible for the current user',
    type: ReviewListResponseDto,
  })
  @Get()
  async getAll(@CurrentUser() user: Session): Promise<ReviewListResponseDto> {
    return this.reviewService.getAll(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get review by ID',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.getById(id, user);
  }

  @ApiResponse({
    status: 201,
    description: 'Create review',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.create(createReviewDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Update review',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: CreateReviewDto,
    @CurrentUser() user: Session,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.updateById(id, updateReviewDto, user);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete review',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    await this.reviewService.deleteById(id, user);
  }
}
