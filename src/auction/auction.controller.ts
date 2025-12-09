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
  ParseIntPipe,
} from '@nestjs/common';
import {
  AuctionListResponseDto,
  AuctionResponseDto,
  CreateAuctionRequestDto,
} from './auction.dto';
import { AuctionService } from './auction.service';
import { Role } from '../auth/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Public()
  @Get()
  async getAll(): Promise<AuctionListResponseDto> {
    return this.auctionService.getAll();
  }

  @Public()
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.getById(id);
  }

  @Post()
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.create(createAuctionDto);
  }

  @Put(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.updateById(id, updateAuctionDto);
  }

  @Delete(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.auctionService.deleteById(id);
  }
}
