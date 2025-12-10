import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import {
  BidListResponseDto,
  BidResponseDto,
  CreateBidDto,
  UpdateBidDto,
} from './bid.dto';
import { BidService } from './bid.service';
import { Role } from '../auth/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Bids')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all bids visible for the current user',
    type: BidListResponseDto,
  })
  @Get()
  async getAll(@CurrentUser() user: Session): Promise<BidListResponseDto> {
    return this.bidService.getAll(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all bids for a given auction',
    type: BidListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Auction not found',
  })
  @Get('auction/:auctionId')
  async getByAuction(
    @Param('auctionId', ParseIntPipe) auctionId: number,
  ): Promise<BidListResponseDto> {
    return this.bidService.getByAuction(auctionId);
  }

  @ApiResponse({
    status: 200,
    description: 'Get bid by ID',
    type: BidResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.getById(id, user);
  }

  @ApiResponse({
    status: 201,
    description: 'Create bid',
    type: BidResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.create(createBidDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Update bid',
    type: BidResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBidDto,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.updateById(id, dto, user);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete bid',
  })
  @ApiResponse({
    status: 404,
    description: 'Bid not found',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    await this.bidService.deleteById(id, user);
  }
}
