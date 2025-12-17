import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { LotService } from './lot.service';
import {
  CreateLotDto,
  LotDetailResponseDto,
  LotListResponseDto,
  LotResponseDto,
} from './lot.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';
import { FavoriteLotToggleResponseDto, FavoriteLotListDto } from './lot.dto';
import { computeTimeStatus } from '../utils/status';

@ApiTags('Lots')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('lots')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all lots',
    type: LotListResponseDto,
  })
  @Public()
  @Get()
  async getAll(): Promise<LotListResponseDto> {
    return this.lotService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get lot by ID',
    type: LotDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lot not found',
  })
  @Public()
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LotDetailResponseDto> {
    return this.lotService.getById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Create lot',
    type: LotResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLotDto: CreateLotDto,
    @CurrentUser() user: { id: number },
  ): Promise<LotResponseDto> {
    const status = computeTimeStatus(
      createLotDto.startTime,
      createLotDto.endTime,
    );

    return this.lotService.create({
      ...createLotDto,
      requesterId: user.id,
      status,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Update lot',
    type: LotResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Lot not found',
  })
  @Put(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: CreateLotDto,
    @CurrentUser() user: { id: number },
  ): Promise<LotResponseDto> {
    const status = computeTimeStatus(
      updateLotDto.startTime,
      updateLotDto.endTime,
    );

    return this.lotService.updateById(id, {
      ...updateLotDto,
      requesterId: user.id,
      status,
    });
  }

  @ApiResponse({
    status: 204,
    description: 'Delete lot',
  })
  @ApiResponse({
    status: 404,
    description: 'Lot not found',
  })
  @Delete(':id')
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.lotService.deleteById(id);
  }

  @Post(':lotId/favorite')
  @ApiResponse({
    status: 200,
    description: 'Toggle favorite status for this lot for the current user',
    type: FavoriteLotToggleResponseDto,
  })
  async toggleFavorite(
    @Param('lotId', ParseIntPipe) lotId: number,
    @CurrentUser() user: Session,
  ): Promise<FavoriteLotToggleResponseDto> {
    return this.lotService.toggleFavorite(user.id, lotId);
  }

  @Get('favorites/me')
  @ApiResponse({
    status: 200,
    description: 'Get favorite lots for the current user',
    type: FavoriteLotListDto,
  })
  async getMyFavorites(
    @CurrentUser() user: Session,
  ): Promise<FavoriteLotListDto> {
    return this.lotService.getFavoritesForUser(user.id);
  }

  @Post(':lotId/buy')
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Buy lot now and create contract',
  })
  async buyNow(
    @Param('lotId', ParseIntPipe) lotId: number,
    @CurrentUser() user: Session,
  ) {
    const result = await this.lotService.buyNow(lotId, user.id);
    return result;
  }
}
