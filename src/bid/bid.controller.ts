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
} from '@nestjs/common';
import {
  BidListResponseDto,
  BidResponseDto,
  CreateBidDto,
  UpdateBidDto,
} from './bid.dto';
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBidDto,
  ): Promise<BidResponseDto> {
    return this.bidService.updateById(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bidService.deleteById(Number(id));
  }
}
