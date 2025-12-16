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
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

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
    @CurrentUser() user: { id: number },
  ): Promise<AuctionResponseDto> {
    const now = new Date();
    const start = createAuctionDto.startTime;
    const end = createAuctionDto.endTime;

    let status: 'open' | 'closed';
    if (now < start) {
      status = 'closed';
    } else if (now >= start && now <= end) {
      status = 'open';
    } else {
      status = 'closed';
    }
    return this.auctionService.create({
      ...createAuctionDto,
      requesterId: user.id,
      status,
    });
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
    @CurrentUser() user: { id: number },
  ): Promise<AuctionResponseDto> {
    const now = new Date();
    const start = updateAuctionDto.startTime;
    const end = updateAuctionDto.endTime;

    let status: 'open' | 'closed';
    if (now < start) {
      status = 'closed';
    } else if (now >= start && now <= end) {
      status = 'open';
    } else {
      status = 'closed';
    }

    return this.auctionService.updateById(id, {
      ...updateAuctionDto,
      requesterId: user.id,
      status,
    });
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
