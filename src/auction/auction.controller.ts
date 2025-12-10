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
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auctions')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all auctions',
    type: AuctionListResponseDto,
  })
  @Public()
  @Get()
  async getAll(): Promise<AuctionListResponseDto> {
    return this.auctionService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get auction by ID',
    type: AuctionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Auction not found',
  })
  @Public()
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.getById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Create auction',
    type: AuctionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.create(createAuctionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update auction',
    type: AuctionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Auction not found',
  })
  @Put(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuctionDto: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.updateById(id, updateAuctionDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete Auction',
  })
  @ApiResponse({
    status: 404,
    description: 'Auction nogt found',
  })
  @Delete(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.auctionService.deleteById(id);
  }
}
