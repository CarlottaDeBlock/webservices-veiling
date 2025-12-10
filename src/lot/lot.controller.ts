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
  async create(@Body() createLotDto: CreateLotDto): Promise<LotResponseDto> {
    return this.lotService.create(createLotDto);
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
  ): Promise<LotResponseDto> {
    return this.lotService.updateById(id, updateLotDto);
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
}
