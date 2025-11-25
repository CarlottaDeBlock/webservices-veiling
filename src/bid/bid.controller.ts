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
  getAll(): BidListResponseDto {
    return this.bidService.getAll();
  }

  @Get('auction/:auctionId')
  getByAuction(@Param('auctionId') auctionId: string): BidListResponseDto {
    return this.bidService.getByAuction(auctionId);
  }

  @Get(':id')
  getById(@Param('id') id: string): BidResponseDto {
    return this.bidService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBidDto: CreateBidDto): BidResponseDto {
    return this.bidService.create(createBidDto);
  }
}
