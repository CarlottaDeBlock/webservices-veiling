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

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get()
  async getAll(@CurrentUser() user: Session): Promise<BidListResponseDto> {
    return this.bidService.getAll(user);
  }

  @Get('auction/:auctionId')
  async getByAuction(
    @Param('auctionId', ParseIntPipe) auctionId: number,
  ): Promise<BidListResponseDto> {
    return this.bidService.getByAuction(auctionId);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.getById(id, user);
  }

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.create(createBidDto, user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBidDto,
    @CurrentUser() user: Session,
  ): Promise<BidResponseDto> {
    return this.bidService.updateById(id, dto, user);
  }

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
