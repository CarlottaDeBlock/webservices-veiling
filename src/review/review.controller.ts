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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  ReviewListResponseDto,
  ReviewResponseDto,
} from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getAll(): ReviewListResponseDto {
    return this.reviewService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): ReviewResponseDto {
    return this.reviewService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReviewDto: CreateReviewDto): ReviewResponseDto {
    return this.reviewService.create(createReviewDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: CreateReviewDto,
  ): ReviewResponseDto {
    return this.reviewService.updateById(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.reviewService.deleteById(id);
  }
}
