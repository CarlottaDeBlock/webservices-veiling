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
  getAll(): AuctionListResponseDto {
    return this.auctionService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): AuctionResponseDto {
    return this.auctionService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createAuctionDto: CreateAuctionRequestDto,
  ): AuctionResponseDto {
    return this.auctionService.create(createAuctionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuctionDto: CreateAuctionRequestDto,
  ): AuctionResponseDto {
    return this.auctionService.updateById(id, updateAuctionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.auctionService.deleteById(id);
  }
}
