import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  AuctionListResponseDto,
  AuctionResponseDto,
  CreateAuctionRequestDto,
} from './auction.dto';
import { AuctionService } from './auction.service';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async getAll(): Promise<AuctionListResponseDto> {
    return this.auctionService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<AuctionResponseDto> {
    return this.auctionService.getById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.create(createAuctionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.updateById(Number(id), updateAuctionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.auctionService.deleteById(Number(id));
  }
}
