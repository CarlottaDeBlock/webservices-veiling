import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BidListResponseDto, BidResponseDto, CreateBidDto } from './bid.dto';
import { BidService } from './bid.service';

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get()
  async getAll(): Promise<BidListResponseDto> {
    return this.bidService.getAll();
  }

  @Get('auction/:auctionId')
  async getByAuction(
    @Param('auctionId') auctionId: number,
  ): Promise<BidListResponseDto> {
    return this.bidService.getByAuction(auctionId);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<BidResponseDto> {
    return this.bidService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBidDto: CreateBidDto): Promise<BidResponseDto> {
    return this.bidService.create(createBidDto);
  }
}
